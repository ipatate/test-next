import Head from "next/head";
// import Image from "next/image";
import Link from "next/link";
import axios from "axios";

export default function Home({ entries }) {
  return (
    <>
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex flex-col max-w-6xl mx-auto">
        {entries.map((p) => (
          <div key={p.id} className="flex flex-col m-4">
            <h1 className="mb-2 text-lg font-bold">
              <Link href={p.uri}>{p.title}</Link>
            </h1>
            <div dangerouslySetInnerHTML={{ __html: p.body }} />
            <Link passHref href={p.uri}>
              <a className="underline text-blue justify-self-end">See more</a>
            </Link>
          </div>
        ))}
      </main>
      <footer></footer>
    </>
  );
}

// This function gets called at build time
export async function getStaticProps() {
  // axios query with graphql
  const { data } = await axios.post(process.env.API_URL, {
    query: `
            query BlogPosts {
                entries( type: "blog") {
                    ...on blog_blog_Entry {
                    id
                    title
                    body
                    uri
                }
            }
        }
        `,
  });
  return {
    props: {
      entries: data.data.entries,
    },
  };
}
