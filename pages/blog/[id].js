import Head from "next/head";

export default function Post({ post }) {
  return (
    <>
      <Head>
        <title>{post.title}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex flex-col max-w-6xl mx-auto">
        <div className="m-4">
          <h1 className="text-lg font-bold">{post.title}</h1>
          <p>{post.body}</p>
        </div>
      </main>
      <footer></footer>
    </>
  );
}

// This function gets called at build time
export async function getStaticProps({ params }) {
  // Call an external API endpoint to get posts
  const res = await fetch(
    `https://jsonplaceholder.typicode.com/posts/${params.id}`
  );
  const post = await res.json();

  return {
    props: {
      post,
    },
  };
}

export async function getStaticPaths() {
  // Call an external API endpoint to get posts
  const res = await fetch("https://jsonplaceholder.typicode.com/posts");
  const posts = await res.json();

  // Get the paths we want to pre-render based on posts
  const paths = posts.map((post) => `/blog/${post.id}`);

  // We'll pre-render only these paths at build time.
  // { fallback: false } means other routes should 404.
  return { paths, fallback: false };
}
