export const postSchema = {
  type: "object",
  properties: {
    name: { type: "string" },
  },
  required: ["name"],
  additionalProperties: false,
};

export const patchSchema = {
  type: "object",
  properties: {
    name: { type: "string" },
  },
  minProperties: 1,
  additionalProperties: false,
};
