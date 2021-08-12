import { withApollo as createWithApollo } from "next-apollo";
import { apollo_client } from "./apollo-client";

export const withApollo = createWithApollo(apollo_client);
