import { GraphQLError } from "graphql";

export const ERR = {
    BAD_USER_INPUT: "BAD_USER_INPUT",
    NOT_FOUND: "NOT_FOUND",
    CONFLICT: "CONFLICT",
    FORBIDDEN: "FORBIDDEN",
    UNAUTHENTICATED: "UNAUTHENTICATED",
    INTERNAL_SERVER_ERROR: "INTERNAL_SERVER_ERROR"
};

export const GQLError = {
    badInput: (message = "Invalid input", fields) =>
        new GraphQLError(message, {extensions: { code: ERR.BAD_USER_INPUT, http: { status: 400 }, fields },}),

    notFound: (message = "Not found") =>
        new GraphQLError(message, {extensions: { code: ERR.NOT_FOUND, http: { status: 404 } },}),

    conflict: (message = "Conflict") =>
        new GraphQLError(message, {extensions: { code: ERR.CONFLICT, http: { status: 409 } },}),

    forbidden: (message = "Forbidden") =>
        new GraphQLError(message, {extensions: { code: ERR.FORBIDDEN, http: { status: 403 } },}),

    unauthenticated: (message = "Unauthenticated") =>
        new GraphQLError(message, {extensions: { code: ERR.UNAUTHENTICATED, http: { status: 401 } },}),

    internal: (message = "Internal server error") =>
        new GraphQLError(message, {extensions: { code: ERR.INTERNAL_SERVER_ERROR, http: { status: 500 } },}),
};

export function zodToBadInput(zodError, prefix) {
    const fields = zodError.errors?.map(e => ({
    path: Array.isArray(e.path) ? e.path.join(".") : String(e.path ?? ""),
    message: e.message,
    code: e.code,
  }));

  return GQLError.badInput(prefix, fields);
}

export default { GQLError, zodToBadInput };


