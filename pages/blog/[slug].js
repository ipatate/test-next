import { useEffect, useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import axios from "axios";

export default function Post({ entry }) {
  const route = useRouter();
  const [_entry, setEntry] = useState(entry);
  useEffect(async () => {
    const { query } = route;
    const { token, slug } = query;
    if (
      !_entry &&
      token &&
      (query["x-craft-live-preview"] || query["x-craft-preview"])
    ) {
      // if craft preview send token
      const headers = {
        "x-Craft-Token": token ? `${token}` : "",
      };
      const { data } = await axios.post(process.env.API_URL, {
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
      });
      const { entry } = data.data.entry;
      setEntry(entry);
    }
  }, [route]);
  return (
    <>
      {_entry ? (
        <>
          <Head>
            <title>{_entry.title}</title>
            <link rel="icon" href="/favicon.ico" />
          </Head>
          <main className="flex flex-col max-w-6xl mx-auto">
            <div className="m-4">
              <h1 className="text-lg font-bold">{_entry.title}</h1>
              <div dangerouslySetInnerHTML={{ __html: _entry.body }} />
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
  console.log(preview, previewData);
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
                entry(slug: "${slug}") {
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
  return {
    props: {
      entry: data.data.entry,
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
