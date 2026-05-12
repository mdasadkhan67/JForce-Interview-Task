import { Link, useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import ExpenseForm from '../components/ExpenseForm'
import Navbar from '../components/Navbar'
import SEO from '../components/SEO'

const AddExpense = () => {
    const { id } = useParams()

    const { tasks } = useSelector(
        (state) => state.tasks
    )

    const taskToEdit = tasks?.find(
        (task) => String(task.id) === String(id)
    )

    const isEditing = Boolean(id)

    return (
        <>
            <SEO
                title={isEditing ? 'Edit Expense' : 'Add Expense'}
                description={isEditing ? 'Edit your expense details' : 'Add a new expense to your list'}
                keywords={isEditing ? 'edit, expense' : 'add, expense'}
            />
            <div className='min-h-screen bg-gray-100'>

                {/* Navbar */}
                <Navbar />


                <div className='mx-auto mt-10 max-w-5xl rounded-xl bg-white p-10 shadow-lg'>


                    <div className='mb-10 flex items-center justify-between'>


                        <Link
                            to='/expenses-list'
                            className='rounded-lg bg-blue-500 px-6 py-3 font-medium text-white transition hover:bg-blue-600'
                        >
                            Back
                        </Link>

                    </div>


                    <ExpenseForm
                        isEditing={isEditing}
                        taskToEdit={taskToEdit}
                    />

                </div>
            </div>
        </>
    )
}

export default AddExpense