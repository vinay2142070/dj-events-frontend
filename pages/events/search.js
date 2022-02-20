import EventItem from "@/components/EventItem";
import Layout from "@/components/Layout";
import { API_URL, NEXT_URL } from "@/config/index";
import Link from "next/link";
import { useRouter } from "next/router";
import qs from 'qs'
import styles from '@/styles/Event.module.css'


export default function SearchPage({ events }) {
    const e = events.data
    const router = useRouter()

    return (
        < Layout >
            <h1>Searching for {router.query.search_item}</h1>
            <ul>
                {
                    e.map((evt) => {
                        return <EventItem key={evt.id} evt={evt.attributes} />
                    })
                }

            </ul>
            <Link href='/events'>
                <a className={styles.back}>{'<'} Go Back</a>
            </Link>
        </Layout >
    )
}




export async function getServerSideProps(context) {

    const query = qs.stringify({
        filters: {
            $or: [
                {
                    name: {
                        $contains: context.query.search_item,
                    }
                },
                {
                    performers: {
                        $contains: context.query.search_item,
                    }
                },
                {
                    venue: {
                        $contains: context.query.search_item,
                    }
                },
                {
                    description: {
                        $contains: context.query.search_item,
                    }
                },
            ]

        },
    }, {
        encodeValuesOnly: true,
    });

    const requesturi = `${API_URL}/api/events?${query}&populate=*`

    const response = await fetch(requesturi)
    const events = await response.json()

    return (
        {
            props: {
                events
            },

        }

    )
}