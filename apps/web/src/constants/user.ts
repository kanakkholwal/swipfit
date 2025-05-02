export const USER_GENDER_GROUPS = {
  MEN: "men",
  WOMEN: "women",
  BOY: "boy",
  GIRL: "girl",
  NOT_SPECIFIED: "not_specified",
} as const;

export const USER_ROLES = {
  BRAND: "brand",
  INFLUENCER: "influencer",
  CUSTOMER: "customer",
  ADMIN: "admin",
} as const;

export const USER_GENDER_GROUPS_ENUMS = Object.values(USER_GENDER_GROUPS)
export const USER_ROLES_ENUMS = Object.values(USER_ROLES);
