import { useEffect, useState } from "react";
import Head from "next/head";
import Error from "next/error";
import { useRouter } from "next/router";
import axios from "axios";

export default function Post({ entry }) {
  if (!entry) {
    return <Error statusCode={404} />;
  }
  return (
    <>
      {entry ? (
        <>
          <Head>
            <title>{entry.title}</title>
            <link rel="icon" href="/favicon.ico" />
          </Head>
          <main className="flex flex-col max-w-6xl mx-auto">
            <div className="m-4">
              <h1 className="text-lg font-bold">{entry.title}</h1>
              <div dangerouslySetInnerHTML={{ __html: entry.body }} />
            </div>
          </main>
        </>
      ) : null}
    </>
  );
}

// This function gets called at build time
export async function getStaticProps({ params, preview, previewData }) {
  let headers = {};
  const { slug } = params;
  if (preview && previewData) {
    headers = {
      "x-Craft-Token": previewData.previewToken
        ? `${previewData.previewToken}`
        : "",
    };
  }
  // axios query with graphql
  const { data } = await axios.post(
    process.env.API_URL,
    {
      query: `
             query BlogPost {
                entry(slug: "${slug}", status: ["live", "disabled"]) {
                    ...on blog_blog_Entry {
                        title
                        body
                        status
                    }
                }
            }
        `,
    },
    { headers }
  );

  const { status } = data.data.entry;
  const display =
    status === "live" ? true : status === "disabled" && preview ? true : false;

  return {
    notFound: !display,
    props: {
      entry: display ? data.data.entry : null,
    },
  };
}

export async function getStaticPaths() {
  // Call an external API endpoint to get posts
  const { data } = await axios.post(process.env.API_URL, {
    query: `
            query BlogPosts {
                entries( type: "blog") {
                    ...on blog_blog_Entry {
                    uri
                    status
                }
            }
        }
        `,
  });

  const { entries } = data.data;
  // Get the paths we want to pre-render based on posts
  const paths = entries.map((entry) => `/${entry.uri}`);
  // We'll pre-render only these paths at build time.
  // { fallback: false } means other routes should 404.
  return { paths, fallback: true };
}
