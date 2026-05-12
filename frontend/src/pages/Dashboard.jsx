import Navbar from '../components/Navbar'
import { Link } from 'react-router'
import SEO from '../components/SEO'

const Dashboard = () => {

    return (
        <>
            <SEO
                title='Dashboard'
                description='Welcome to the Expense Tracker Dashboard. Manage your expenses effectively.'
                keywords='dashboard, expense tracker, manage expenses'
            />
            <div className='min-h-screen bg-gray-100'>
                <Navbar />
                <div className='mx-auto mt-10 max-w-6xl px-5'>
                    {/* Main Card */}
                    <div className='rounded-lg bg-white p-10 shadow-md'>
                        {/* Heading */}
                        <h1 className='text-center text-4xl font-bold text-gray-800'>
                            Welcome to Expense Tracker
                        </h1>
                        {/* Buttons */}
                        <div className='mt-6 flex justify-center gap-5'>
                            <Link to='/add-expense' className='rounded-md bg-green-500 px-5 py-2 text-white hover:bg-green-600 transition'>
                                Add Expense
                            </Link>
                            <Link
                                to='/expenses-list'
                                className='rounded-md bg-blue-500 px-5 py-2 text-white hover:bg-blue-600 transition'
                            >Expense List</Link>
                        </div>
                        {/* Description */}
                        <p className='mt-6 text-center text-gray-500'>
                            Track and manage your expenses effectively.
                            Use the navigation links to add new expenses
                            or view your expense history.
                        </p>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Dashboard