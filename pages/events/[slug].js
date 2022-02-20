
import Layout from '@/components/Layout'
import { API_URL } from '@/config/index'
import { useRouter } from 'next/router'
import Link from 'next/link'
import Image from 'next/image'
import React from 'react'
import styles from '@/styles/Event.module.css'

import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { FaPencilAlt, FaPencilRuler, FaRecycle, FaTimes, FaTrash } from 'react-icons/fa'
import EventMap from '@/components/EventMap'


export default function EventDetailPage({ event }) {

    const evt = event.attributes
    const router = useRouter()


    const onDeleteHandler = async () => {
        const response = await fetch(`${NEXT_URL}/api/events/${event.id}`, {
            method: 'DELETE'
        })
        const evt = await response.json()
        if (!response.ok) {
            toast.error(response.statusText)
        }
        else {
            toast.error('Event deleted successfully')

        }
        router.push('/events')


    }
    const onEditHandler = () => {

        router.push(`/events/edit/${event.id}`)
    }

    return (
        <Layout>

            {/* <div onClick={onEditHandler} ><FaPencilAlt />Edit</div>
            <div onClick={onDeleteHandler} ><FaTrash />Delete</div> */}

            <div className={styles.event}>
                <span>
                    {new Date(evt.date).toLocaleDateString('en-US')} at {evt.time}
                </span>
                <h1>{evt.name}</h1>

                {evt.image.data && (
                    <div className={styles.image}>
                        <Image
                            src={evt.image.data.attributes.url}
                            width={960}
                            height={600}
                        />
                    </div>
                )}

                <h3>Performers:</h3>
                <p>{evt.performers}</p>
                <h3>Description:</h3>
                <p>{evt.description}</p>
                <h3>Venue: {evt.venue}</h3>
                <p>{evt.address}</p>

                <EventMap evt={evt} />

                <Link href='/events'>
                    <a className={styles.back}>{'<'} Go Back</a>
                </Link>
            </div>
        </Layout>
    )
}

// export async function getStaticPaths() {
//     const response = await fetch(`${NEXT_URL}/api/events?populate=*`)
//     const evts = await response.json()


//     const paths = evts.data.map((e) => (
//         { params: { slug: e.attributes.slug } }
//     ))

//     return {
//         paths,
//         fallback: true
//     }
// }

export async function getServerSideProps(context) {

    const response = await fetch(`${API_URL}/api/events?filters[slug][$eq]=${context.params.slug}&populate=*`)
    const evt = await response.json()


    return {
        props: {
            event: evt.data[0]
        },

    }
}

