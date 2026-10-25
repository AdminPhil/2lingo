import { vi } from "vitest";
import { podMembers, pods, userProgress } from "@/db/schema";

export interface MockStore {
  pods: any[];
  podMembers: any[];
  userProgress: any[];
}

function toCamelCase(str: string): string {
  return str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
}

function getItemValue(item: any, colName: string): any {
  if (!item) return undefined;
  const camel = toCamelCase(colName);
  return item[camel] !== undefined ? item[camel] : item[colName];
}

interface ExtractedCondition {
  col: string;
  op: string;
  val: any;
}

function unwrapParam(val: any): any {
  if (val && typeof val === "object" && "value" in val && !Array.isArray(val)) {
    return unwrapParam(val.value);
  }
  return val;
}

function unwrapValue(val: any): any {
  const unwrapped = unwrapParam(val);
  if (Array.isArray(unwrapped)) {
    return unwrapped.map((item) => unwrapValue(item));
  }
  return unwrapped;
}

function extractConditions(sql: any): ExtractedCondition[] {
  if (!sql) return [];
  if (typeof sql === "function") return [];
  if (!sql.queryChunks) return [];

  const results: ExtractedCondition[] = [];
  const chunks = sql.queryChunks;

  for (let i = 0; i < chunks.length; i++) {
    const chunk = chunks[i];
    if (chunk?.queryChunks) {
      results.push(...extractConditions(chunk));
    } else if (chunk?.name) {
      const colName = chunk.name;
      for (let j = i + 1; j < chunks.length; j++) {
        const next = chunks[j];
        if (next?.value && Array.isArray(next.value) && typeof next.value[0] === "string") {
          const str = next.value[0].trim();
          if (str === "=" || str === "in" || str === ">=" || str === "<=") {
            const valChunk = chunks[j + 1];
            results.push({ col: colName, op: str, val: unwrapValue(valChunk) });
            break;
          }
        }
      }
    }
  }
  return results;
}

function matchesCondition(item: any, cond: any, store: MockStore): boolean {
  if (!cond) return true;
  if (typeof cond === "function") return Boolean(cond(item));

  const conditions = extractConditions(cond);
  if (conditions.length === 0) return true;

  for (const c of conditions) {
    const itemVal = getItemValue(item, c.col);

    if (c.op === "=") {
      if (itemVal !== c.val) return false;
    } else if (c.op === ">=") {
      if (itemVal === undefined || itemVal === null || itemVal < c.val) return false;
    } else if (c.op === "<=") {
      if (itemVal === undefined || itemVal === null || itemVal > c.val) return false;
    } else if (c.op === "in") {
      if (itemVal === undefined || itemVal === null) return false;
      const targetVal = unwrapValue(c.val);
      if (Array.isArray(targetVal)) {
        if (!targetVal.includes(itemVal)) return false;
      } else if (targetVal && typeof targetVal === "object") {
        // Subquery handling, e.g. db.select({ id: pods.id }).from(pods).where(eq(pods.ownerId, callerUserId))
        const subqueryConditions = extractConditions(targetVal.whereCond || targetVal);
        const subqueryTable = targetVal.selectedTable || pods;

        let sourceList: any[] = [];
        if (subqueryTable === pods || isTable(subqueryTable, "pods")) {
          sourceList = store.pods;
        } else if (subqueryTable === podMembers || isTable(subqueryTable, "pod_members")) {
          sourceList = store.podMembers;
        } else if (subqueryTable === userProgress || isTable(subqueryTable, "user_progress")) {
          sourceList = store.userProgress;
        }

        const matchingPods = sourceList.filter((sourceItem) => {
          if (subqueryConditions.length === 0) return true;
          return subqueryConditions.every((sc) => {
            const scVal = getItemValue(sourceItem, sc.col);
            return sc.op === "=" ? scVal === sc.val : true;
          });
        });

        const allowedIds = matchingPods.map((p) => p.id ?? p.userId);
        if (!allowedIds.includes(itemVal)) return false;
      }
    }
  }

  return true;
}

function isTable(table: any, expectedName: string): boolean {
  if (!table) return false;
  const name =
    table[Symbol.for("drizzle:Name")] ||
    table[Symbol.for("drizzle:OriginalName")] ||
    table._?.name ||
    table.name;
  return name === expectedName;
}

export const createMockDb = (initialStore?: Partial<MockStore>) => {
  const store: MockStore = {
    pods: [...(initialStore?.pods || [])],
    podMembers: [...(initialStore?.podMembers || [])],
    userProgress: [...(initialStore?.userProgress || [])],
  };

  const mockDb: any = {
    _isMockDb: true,
    store,
    query: {
      pods: {
        findFirst: vi.fn(async (opts?: any) => {
          return store.pods.find((p) => matchesCondition(p, opts?.where, store)) || null;
        }),
        findMany: vi.fn(async (opts?: any) => {
          const list = opts?.where
            ? store.pods.filter((p) => matchesCondition(p, opts?.where, store))
            : [...store.pods];
          if (opts?.with?.members) {
            return list.map((p) => ({
              ...p,
              members: store.podMembers.filter((m) => m.podId === p.id),
            }));
          }
          return list;
        }),
      },
      podMembers: {
        findFirst: vi.fn(async (opts?: any) => {
          return store.podMembers.find((m) => matchesCondition(m, opts?.where, store)) || null;
        }),
        findMany: vi.fn(async (opts?: any) => {
          const list = opts?.where
            ? store.podMembers.filter((m) => matchesCondition(m, opts?.where, store))
            : [...store.podMembers];
          if (opts?.with?.pod) {
            return list.map((m) => ({
              ...m,
              pod: store.pods.find((p) => p.id === m.podId) || null,
            }));
          }
          return list;
        }),
      },
      userProgress: {
        findFirst: vi.fn(async (opts?: any) => {
          return store.userProgress.find((u) => matchesCondition(u, opts?.where, store)) || null;
        }),
        findMany: vi.fn(async (opts?: any) => {
          return opts?.where
            ? store.userProgress.filter((u) => matchesCondition(u, opts?.where, store))
            : [...store.userProgress];
        }),
      },
    },
    insert: vi.fn((table: any) => ({
      values: vi.fn((val: any) => {
        const items = Array.isArray(val) ? val : [val];
        const insertedItems: any[] = [];

        for (const item of items) {
          const cloned = { ...item };
          if (table === userProgress || isTable(table, "user_progress")) {
            store.userProgress.push(cloned);
          } else if (table === podMembers || isTable(table, "pod_members")) {
            if (!cloned.id) cloned.id = store.podMembers.length + 1;
            if (!cloned.joinedAt) cloned.joinedAt = new Date();
            store.podMembers.push(cloned);
          } else if (table === pods || isTable(table, "pods")) {
            if (!cloned.id) cloned.id = store.pods.length + 1;
            store.pods.push(cloned);
          }
          insertedItems.push(cloned);
        }

        return {
          returning: vi.fn(async () => insertedItems),
          then: (resolve: any) => Promise.resolve(insertedItems).then(resolve),
        };
      }),
    })),
    update: vi.fn((table: any) => ({
      set: vi.fn((values: any) => ({
        where: vi.fn(async (cond: any) => {
          let targetList: any[] = [];
          if (table === userProgress || isTable(table, "user_progress")) {
            targetList = store.userProgress;
          } else if (table === pods || isTable(table, "pods")) {
            targetList = store.pods;
          } else if (table === podMembers || isTable(table, "pod_members")) {
            targetList = store.podMembers;
          }

          const updated: any[] = [];
          for (const item of targetList) {
            if (matchesCondition(item, cond, store)) {
              Object.assign(item, values);
              updated.push(item);
            }
          }
          return updated;
        }),
      })),
    })),
    delete: vi.fn((table: any) => ({
      where: vi.fn(async (cond: any) => {
        let deleted: any[] = [];
        if (table === userProgress || isTable(table, "user_progress")) {
          const kept = store.userProgress.filter((u) => !matchesCondition(u, cond, store));
          deleted = store.userProgress.filter((u) => matchesCondition(u, cond, store));
          store.userProgress.length = 0;
          store.userProgress.push(...kept);
        } else if (table === podMembers || isTable(table, "pod_members")) {
          const kept = store.podMembers.filter((m) => !matchesCondition(m, cond, store));
          deleted = store.podMembers.filter((m) => matchesCondition(m, cond, store));
          store.podMembers.length = 0;
          store.podMembers.push(...kept);
        } else if (table === pods || isTable(table, "pods")) {
          const kept = store.pods.filter((p) => !matchesCondition(p, cond, store));
          deleted = store.pods.filter((p) => matchesCondition(p, cond, store));
          store.pods.length = 0;
          store.pods.push(...kept);
        }
        return deleted;
      }),
    })),
    select: vi.fn((fields?: any) => {
      let selectedTable: any = null;
      let whereCond: any = null;

      const queryObj: any = {
        _isSelectQuery: true,
        get selectedTable() {
          return selectedTable;
        },
        get whereCond() {
          return whereCond;
        },
        from: vi.fn((table: any) => {
          selectedTable = table;
          return queryObj;
        }),
        where: vi.fn((cond: any) => {
          whereCond = cond;
          return queryObj;
        }),
        execute: async () => {
          let source: any[] = [];
          if (selectedTable === podMembers || isTable(selectedTable, "pod_members")) {
            source = store.podMembers;
          } else if (selectedTable === pods || isTable(selectedTable, "pods")) {
            source = store.pods;
          } else if (selectedTable === userProgress || isTable(selectedTable, "user_progress")) {
            source = store.userProgress;
          }

          const filtered = whereCond
            ? source.filter((item) => matchesCondition(item, whereCond, store))
            : [...source];

          // Handle count aggregation: select({ count: sql`count(*)` })
          if (fields && typeof fields === "object" && "count" in fields) {
            return [{ count: filtered.length }];
          }

          // Handle projections
          if (fields && typeof fields === "object") {
            const keys = Object.keys(fields);
            return filtered.map((item) => {
              const res: any = {};
              for (const k of keys) {
                const col = fields[k];
                const colName = col?.name || k;
                res[k] = getItemValue(item, colName);
              }
              return res;
            });
          }

          return filtered;
        },
        then: (resolve: any, reject: any) => {
          return queryObj.execute().then(resolve, reject);
        },
      };

      return queryObj;
    }),
    transaction: vi.fn(async (callback: (tx: any) => Promise<any>) => {
      const snapshot = {
        pods: JSON.parse(JSON.stringify(store.pods)),
        podMembers: JSON.parse(JSON.stringify(store.podMembers)),
        userProgress: JSON.parse(JSON.stringify(store.userProgress)),
      };
      try {
        return await callback(mockDb);
      } catch (err) {
        store.pods = snapshot.pods;
        store.podMembers = snapshot.podMembers;
        store.userProgress = snapshot.userProgress;
        throw err;
      }
    }),
  };

  return { mockDb, store };
};

const defaultInstance = createMockDb();
export const mockDb = defaultInstance.mockDb;
export const store = defaultInstance.store;

export const resetMockDb = (initialStore?: Partial<MockStore>) => {
  store.pods.length = 0;
  if (initialStore?.pods) store.pods.push(...initialStore.pods);

  store.podMembers.length = 0;
  if (initialStore?.podMembers) store.podMembers.push(...initialStore.podMembers);

  store.userProgress.length = 0;
  if (initialStore?.userProgress) store.userProgress.push(...initialStore.userProgress);

  mockDb.insert.mockClear();
  mockDb.update.mockClear();
  mockDb.delete.mockClear();
  mockDb.select.mockClear();
  mockDb.transaction.mockClear();
  mockDb.query.pods.findFirst.mockClear();
  mockDb.query.pods.findMany.mockClear();
  mockDb.query.podMembers.findFirst.mockClear();
  mockDb.query.podMembers.findMany.mockClear();
  mockDb.query.userProgress.findFirst.mockClear();
  mockDb.query.userProgress.findMany.mockClear();
};
