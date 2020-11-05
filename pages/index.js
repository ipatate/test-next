import Head from "next/head";
import Image from "next/image";
import Link from "next/link";

export default function Home({ posts }) {
  return (
    <>
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex flex-col max-w-6xl mx-auto">
        <Image
          src="/20160816_095755_resized.jpg"
          alt="Picture of the author"
          unsized
          layout="responsive"
        />
        {posts.map((p) => (
          <div key={p.id} className="flex flex-col m-4">
            <h1 className="text-lg font-bold mb-2">
              <Link href={`/blog/${p.id}`}>{p.title}</Link>
            </h1>
            <p>{p.body}</p>
            <Link passHref href={`/blog/${p.id}`}>
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
  // Call an external API endpoint to get posts
  const res = await fetch("https://jsonplaceholder.typicode.com/posts");
  const posts = await res.json();

  // By returning { props: posts }, the Blog component
  // will receive `posts` as a prop at build time
  return {
    props: {
      posts,
    },
  };
}
