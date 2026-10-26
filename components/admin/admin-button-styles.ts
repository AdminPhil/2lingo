export const ADMIN_BTN_BASE =
  "h-9 px-3.5 text-xs font-extrabold border-2 cursor-pointer shadow-none active:border-2";

/** The single filled action in a region (e.g. "Add Learner"). */
export const ADMIN_BTN_PRIMARY = `${ADMIN_BTN_BASE} bg-blue-600 hover:bg-blue-700 text-white border-blue-700`;

/** Every other button: white, dark outline. Colour lives only in the icon. */
export const ADMIN_BTN_SECONDARY = `${ADMIN_BTN_BASE} bg-white hover:bg-blue-50 text-slate-800 border-slate-400 hover:border-blue-900`;
