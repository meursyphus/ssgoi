/** The mock user's one wishlist. Lives in the client module only. */
const list = {
  key: "saved",
  title: "Summer in Korea",
  /** Newest first */
  ids: ["l-002"],
};

export const data = {
  key: list.key,
  title: list.title,
  savedIds: () => [...list.ids],
  toggle: (id: string) => {
    const idx = list.ids.indexOf(id);
    if (idx >= 0) {
      list.ids.splice(idx, 1);
      return false;
    }
    list.ids.unshift(id);
    return true;
  },
};
