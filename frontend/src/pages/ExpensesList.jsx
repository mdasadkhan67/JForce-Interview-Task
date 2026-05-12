import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getTasks, deleteTask } from '../features/tasks/taskSlice'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import Navbar from '../components/Navbar'
import SEO from '../components/SEO'

const ExpensesList = () => {
    const dispatch = useDispatch()

    const { tasks, isLoading } = useSelector(
        (state) => state.tasks
    )

    // Fetch Expenses
    useEffect(() => {
        dispatch(getTasks())
    }, [dispatch])

    // Delete Expense
    const handleDelete = async (id) => {
        const confirmDelete = window.confirm(
            'Are you sure you want to delete this expense?'
        )

        if (confirmDelete) {
            try {
                await dispatch(deleteTask(id)).unwrap()

                toast.success('Expense Deleted Successfully!')
            } catch (error) {
                console.log(error)

                toast.error('Delete Failed!')
            }
        }
    }

    return (
        <>
            <SEO
                title='Expenses List'
                description='View and manage all your expenses in one place.'
                keywords='expenses list, manage expenses, view expenses'
            />
            <div className='min-h-screen bg-gray-100'>

                {/* Navbar */}
                <Navbar />

                <div className='mx-auto mt-10 max-w-7xl rounded-xl bg-white p-8 shadow-lg'>

                    {/* Header */}
                    <div className='mb-8 flex items-center justify-between'>

                        <div>
                            <h1 className='text-4xl font-bold text-gray-800'>
                                Expenses List
                            </h1>

                            <p className='mt-2 text-gray-500'>
                                Manage all your expenses here
                            </p>
                        </div>

                        {/* Add Expense Button */}
                        <Link
                            to='/add-expense'
                            className='rounded-lg bg-green-600 px-6 py-3 font-medium text-white transition hover:bg-green-700'
                        >
                            + Add Expense
                        </Link>

                    </div>

                    {/* Loading */}
                    {isLoading ? (
                        <div className='py-10 text-center text-lg font-medium'>
                            Loading...
                        </div>
                    ) : tasks?.length === 0 ? (
                        <div className='py-10 text-center text-gray-500'>
                            No expenses found
                        </div>
                    ) : (
                        <div className='overflow-x-auto'>

                            <table className='w-full border-collapse'>

                                {/* Table Header */}
                                <thead>
                                    <tr className='bg-gray-100 text-gray-700'>

                                        <th className='rounded-l-lg px-6 py-4 text-left'>
                                            Sr No
                                        </th>

                                        <th className='px-6 py-4 text-left'>
                                            Expense Name
                                        </th>

                                        <th className='px-6 py-4 text-left'>
                                            Amount
                                        </th>

                                        <th className='px-6 py-4 text-left'>
                                            Expense Date
                                        </th>

                                        <th className='px-6 py-4 text-left'>
                                            Description
                                        </th>

                                        <th className='rounded-r-lg px-6 py-4 text-center'>
                                            Actions
                                        </th>

                                    </tr>
                                </thead>

                                {/* Table Body */}
                                <tbody>
                                    {tasks?.map((task, index) => (
                                        <tr
                                            key={task.id}
                                            className='border-b transition hover:bg-gray-50'
                                        >

                                            <td className='px-6 py-4'>
                                                {index + 1}
                                            </td>

                                            <td className='px-6 py-4 font-medium text-gray-800'>
                                                {task.expenseName}
                                            </td>

                                            <td className='px-6 py-4 text-green-600 font-semibold'>
                                                ₹ {task.amount}
                                            </td>

                                            <td className='px-6 py-4'>
                                                {task.expenseDate?.split('T')[0]}
                                            </td>

                                            <td className='max-w-xs truncate px-6 py-4 text-gray-600'>
                                                {task.description}
                                            </td>

                                            {/* Actions */}
                                            <td className='px-6 py-4'>

                                                <div className='flex justify-center gap-3'>

                                                    {/* Edit */}
                                                    <Link
                                                        to={`/edit-expense/${task.id}`}
                                                        className='rounded-lg bg-blue-500 px-4 py-2 text-white transition hover:bg-blue-600'
                                                    >
                                                        Edit
                                                    </Link>

                                                    {/* Delete */}
                                                    <button
                                                        onClick={() =>
                                                            handleDelete(task.id)
                                                        }
                                                        className='rounded-lg bg-red-500 px-4 py-2 text-white transition hover:bg-red-600'
                                                    >
                                                        Delete
                                                    </button>

                                                </div>

                                            </td>
                                        </tr>
                                    ))}
                                </tbody>

                            </table>
                        </div>
                    )}
                </div>
            </div>
        </>
    )
}

export default ExpensesList