import { UsernamePasswordInput } from "src/resolvers/UsernamePasswordInput";

export const validateRegister = (options: UsernamePasswordInput) => {
  if (options.username.length <= 2) {
    return [
      {
        field: "username",
        message: "lenght must be greather than 2",
      },
    ];
  }

  if (options.username.includes("@")) {
    return [
      {
        field: "username",
        message: "invalid username - cannot include '@'",
      },
    ];
  }

  if (!options.email.includes("@") || options.email.length <= 2) {
    return [
      {
        field: "email",
        message: "invalid email",
      },
    ];
  }

  if (options.password.length <= 2) {
    return [
      {
        field: "password",
        message: "lenght must be greather than 2",
      },
    ];
  }
  return null;
};

export const registerErrors = (err) => {
  if (err.code === "23505") {
    if (err.detail.includes("email")) {
      return {
        errors: [
          {
            field: "email",
            message: "email already taken",
          },
        ],
      };
    }
    if (err.detail.includes("username")) {
      return {
        errors: [
          {
            field: "username",
            message: "username already been taken",
          },
        ],
      };
    }
  }
  return null;
};
