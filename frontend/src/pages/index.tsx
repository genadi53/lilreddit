import { Navbar } from "../components/Navbar";
import { withUrqlClient } from "next-urql";
import { CreateUrqlClient } from "../utills/createUrqlClient";
import { usePostsQuery } from "../generated/graphql";

const Index = () => {
  const [{ data }] = usePostsQuery();
  return (
    <>
      <Navbar></Navbar>
      {!data ? (
        <div>loading...</div>
      ) : (
        data.posts.map((p) => <div key={p.id}>{p.title}</div>)
      )}
    </>
  );
};
export default withUrqlClient(CreateUrqlClient, { ssr: true })(Index);
