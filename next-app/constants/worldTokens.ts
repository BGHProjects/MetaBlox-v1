enum Status {
  Owned = "Owned",
  Vacant = "Vacant",
  Unavailable = "Unavailable",
}

const textContent: Record<
  Status,
  { title: string; subtitle: string; buttonTitle: string }
> = {
  [Status.Vacant]: {
    title: "VACANT WORLD",
    subtitle:
      "This world is unowned and available for purchase! You may purchase this world token for 100 MBLOX.",
    buttonTitle: "PURCHASE WORLD",
  },
  [Status.Unavailable]: {
    title: "OWNED WORLD",
    subtitle:
      "This world is owned by user 0xq09qjcjw9q80ecjqwe. You may visit their world to see what they have created!",
    buttonTitle: "VISIT WORLD",
  },
  [Status.Owned]: {
    title: "YOUR WORLD",
    subtitle:
      "You own this world. You may enter now and build to your heart's content.",
    buttonTitle: "START BUILDING",
  },
};

export { Status, textContent };
