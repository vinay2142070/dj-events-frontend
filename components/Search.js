
import styles from '@/styles/Search.module.css'
import { useState } from 'react'
import { useRouter } from 'next/router'
const Search = () => {

    const router = useRouter()

    const [term, setterm] = useState()
    const onSubmitHandler = (e) => {
        e.preventDefault()

        router.push(`/events/search?search_item=${term}`)
        setterm('')

    }

    const onChangeHandler = (e) => {
        setterm(e.target.value)
    }

    return (
        <div className={styles.search}>
            <form onSubmit={onSubmitHandler}>
                <input value={term} placeholder='Search events' onChange={onChangeHandler} />
            </form>
        </div>
    )
}

export default Search