
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { useState } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import Layout from '@/components/Layout'
import { API_URL } from '@/config/index'
import styles from '@/styles/Form.module.css'
import moment from 'moment'
import Image from 'next/image'
import { FaImage } from 'react-icons/fa'
import Modal from '@/components/Modal'
import ImageUpload from '@/components/ImageUpload'
import { parseCookies } from '@/helpers/index'

export default function EditEventPage({ event, token }) {
    const evt = event.attributes
    const [values, setValues] = useState({
        name: evt.name,
        performers: evt.performers,
        venue: evt.venue,
        address: evt.address,
        date: evt.date,
        time: evt.time,
        description: evt.description,
    })

    const [image, setimage] = useState((evt.image.data) ? evt.image.data.attributes.formats.thumbnail.url : null)
    const [showModal, setShowModal] = useState(false)

    const router = useRouter()

    const imageUploaded = async (e) => {
        // const res = await fetch(`${API_URL}/api/events/${event.id}?populate=*`)
        const res = await fetch(`${API_URL}/api/events?filters[id][$eq]=${event.id}&populate=*`)
        const data = await res.json()

        setimage(data.data[0].attributes.image.data.attributes.formats.thumbnail.url)
        setShowModal(false)
    }


    const handleSubmit = async (e) => {
        e.preventDefault()

        // Validation
        const hasEmptyFields = Object.values(values).some(
            (element) => element === ''
        )

        if (hasEmptyFields) {
            toast.error('Please fill in all fields')
        }
        // values.slug = values.name.toLowerCase()

        const res = await fetch(`${API_URL}/api/events/${event.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ data: values }),
        })

        if (!res.ok) {
            if (res.status === 403 || res.status === 401) {
                toast.error('No token included')
                return
            }
            toast.error('Something Went Wrong')
        } else {
            const evt = await res.json()
            //console.log(evt)
            router.push(`/events/${evt.data.attributes.slug}`)
        }
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target
        setValues({ ...values, [name]: value })
    }

    return (
        <Layout title='Edit New Event'>
            <Link href='/events'>Go Back</Link>
            <h1>Edit Event</h1>
            <ToastContainer />
            <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.grid}>
                    <div>
                        <label htmlFor='name'>Event Name</label>
                        <input
                            type='text'
                            id='name'
                            name='name'
                            value={values.name}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div>
                        <label htmlFor='performers'>Performers</label>
                        <input
                            type='text'
                            name='performers'
                            id='performers'
                            value={values.performers}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div>
                        <label htmlFor='venue'>Venue</label>
                        <input
                            type='text'
                            name='venue'
                            id='venue'
                            value={values.venue}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div>
                        <label htmlFor='address'>Address</label>
                        <input
                            type='text'
                            name='address'
                            id='address'
                            value={values.address}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div>
                        <label htmlFor='date'>Date</label>
                        <input
                            type='date'
                            name='date'
                            id='date'
                            value={moment(values.date).format('yyyy-MM-DD')}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div>
                        <label htmlFor='time'>Time</label>
                        <input
                            type='text'
                            name='time'
                            id='time'
                            value={values.time}
                            onChange={handleInputChange}
                        />
                    </div>
                </div>

                <div>
                    <label htmlFor='description'>Event Description</label>
                    <textarea
                        type='text'
                        name='description'
                        id='description'
                        value={values.description}
                        onChange={handleInputChange}
                    ></textarea>
                </div>



                <input type='submit' value='Edit Event' className='btn' />
            </form>

            <div>
                <p><h4>Event Images</h4></p>
                {(image) ? (<Image height={200} width={200} src={image} />) : (<h5>No images found</h5>)}
                <p>  <button className='btn-secondary' onClick={() => setShowModal(true)}><FaImage />Set Image</button>
                </p>
            </div>
            <Modal show={showModal} onClose={() => setShowModal(false)}>
                <ImageUpload
                    evtId={event.id}
                    imageUploaded={imageUploaded}
                    token={token}
                />
            </Modal>
        </Layout>
    )
}


export async function getServerSideProps({ req, params }) {

    const token = req.cookies.token//parseCookies(req)

    const response = await fetch(`${API_URL}/api/events?filters[id][$eq]=${params.id}&populate=*`)
    const evt = await response.json()


    return {
        props: {
            event: evt.data[0],
            token
        },

    }
}
