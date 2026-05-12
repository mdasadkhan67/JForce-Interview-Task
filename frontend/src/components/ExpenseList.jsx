import { useDispatch, useSelector } from 'react-redux'
import { deleteTask } from '../features/tasks/taskSlice'

const ExpenseList = ({ onEdit }) => {
    const dispatch = useDispatch()

    const { tasks } = useSelector((state) => state.tasks)

    const handleDelete = (id) => {
        const confirmDelete = window.confirm(
            'Are you sure you want to delete this task?'
        )

        if (confirmDelete) {
            dispatch(deleteTask(id))
        }
    }

    if (!tasks || tasks.length === 0) {
        return (
            <div className='p-10 text-center text-gray-500'>
                No tasks available
            </div>
        )
    }

    return (
        <table className='w-full'>
            <thead className='bg-gray-100'>
                <tr>
                    <th className='px-6 py-4 text-left'>Sr No</th>
                    <th className='px-6 py-4 text-left'>Expense Name</th>
                    <th className='px-6 py-4 text-left'>Amount</th>
                    <th className='px-6 py-4 text-left'>Date</th>
                    <th className='px-6 py-4 text-center'>Actions</th>
                </tr>
            </thead>

            <tbody>
                {tasks.map((task, index) => (
                    <tr
                        key={task.id}
                        className='border-b hover:bg-gray-50 transition'
                    >
                        <td className='px-6 py-4 font-medium'>
                            {index + 1}
                        </td>

                        <td className='px-6 py-4'>
                            {task.expenseName}
                        </td>

                        <td className='px-6 py-4'>
                            ${task.amount}
                        </td>

                        <td className='px-6 py-4'>
                            {task.expenseDate}
                        </td>

                        <td className='px-6 py-4'>
                            <div className='flex justify-center gap-3'>

                                <button
                                    onClick={() => onEdit(task)}
                                    className='rounded-lg bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-600'
                                >
                                    Edit
                                </button>

                                <button
                                    onClick={() => handleDelete(task.id)}
                                    className='rounded-lg bg-red-500 px-4 py-2 text-sm font-medium text-white hover:bg-red-600'
                                >
                                    Delete
                                </button>

                            </div>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    )
}

export default ExpenseList