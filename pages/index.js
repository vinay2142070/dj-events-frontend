import EventItem from "@/components/EventItem";
import Layout from "@/components/Layout";
import Link from "next/link";
import { API_URL } from "../config/index";



export default function HomePage({ events }) {
  const e = events.data.slice(0, 3)

  return (
    < Layout >
      <h1>Upcoming Events</h1>
      <ul>
        {
          e.map((evt) => {
            return <EventItem key={evt.id} evt={evt.attributes} />
          })
        }

      </ul>

      <Link href='/events'>
        <a className="btn">View All</a>
      </Link>
    </Layout >
  )
}




export async function getStaticProps() {

  const response = await fetch(`${API_URL}/api/events?populate=*`)
  const events = await response.json()
  console.log(events)
  return (
    {
      props: {
        events
      },
      revalidate: 1
    }

  )
}