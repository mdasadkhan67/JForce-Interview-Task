import { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { createTask, updateTask } from '../features/tasks/taskSlice'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'

const ExpenseForm = ({
    isEditing = false,
    taskToEdit = null
}) => {

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const [loading, setLoading] = useState(false)

    const [formData, setFormData] = useState({
        expenseName: '',
        amount: '',
        expenseDate: '',
        description: ''
    })

    const [errors, setErrors] = useState({})

    const {
        expenseName,
        amount,
        expenseDate,
        description
    } = formData

    // =========================
    // Edit Mode
    // =========================
    useEffect(() => {
        if (isEditing && taskToEdit) {
            setFormData({
                expenseName: taskToEdit.expenseName || '',
                amount: taskToEdit.amount || '',
                expenseDate: taskToEdit.expenseDate
                    ? taskToEdit.expenseDate.split('T')[0]
                    : '',
                description: taskToEdit.description || ''
            })
        }
    }, [isEditing, taskToEdit])

    // =========================
    // Handle Change
    // =========================
    const onChange = (e) => {

        const { name, value } = e.target

        // Remove leading spaces
        const cleanValue = value.replace(/^\s+/, '')

        setFormData((prev) => ({
            ...prev,
            [name]: cleanValue
        }))

        // Remove error instantly
        setErrors((prev) => ({
            ...prev,
            [name]: ''
        }))
    }

    // =========================
    // Validation
    // =========================
    const validateForm = () => {

        let newErrors = {}

        // Expense Name Validation
        if (!expenseName.trim()) {
            newErrors.expenseName =
                'Expense name is required'
        }

        else if (expenseName.trim().length < 3) {
            newErrors.expenseName =
                'Minimum 3 characters required'
        }

        else if (expenseName.trim().length > 50) {
            newErrors.expenseName =
                'Maximum 50 characters allowed'
        }

        else if (
            !/^[A-Za-z0-9\s-_&()]+$/.test(expenseName)
        ) {
            newErrors.expenseName =
                'Invalid characters used'
        }

        // Amount Validation
        if (!amount) {
            newErrors.amount =
                'Amount is required'
        }

        else if (isNaN(amount)) {
            newErrors.amount =
                'Amount must be a number'
        }

        else if (Number(amount) <= 0) {
            newErrors.amount =
                'Amount must be greater than 0'
        }

        else if (Number(amount) > 1000000) {
            newErrors.amount =
                'Maximum amount is 10,00,000'
        }

        // Date Validation
        if (!expenseDate) {
            newErrors.expenseDate =
                'Expense date is required'
        }

        else {

            const selectedDate = new Date(expenseDate)
            const today = new Date()

            // Remove time from both dates
            selectedDate.setHours(0, 0, 0, 0)
            today.setHours(0, 0, 0, 0)

            // Allow today, block only future
            if (selectedDate.getTime() > today.getTime()) {

                newErrors.expenseDate =
                    'Future date not allowed'
            }
        }
        // Description Validation
        if (description) {

            if (description.trim().length < 5) {
                newErrors.description =
                    'Minimum 5 characters required'
            }

            else if (description.trim().length > 300) {
                newErrors.description =
                    'Maximum 300 characters allowed'
            }
        }

        setErrors(newErrors)

        return Object.keys(newErrors).length === 0
    }

    // =========================
    // Submit
    // =========================
    const handleSubmit = async (e) => {

        e.preventDefault()

        // Validate First
        if (!validateForm()) {
            toast.error('Please fix validation errors')
            return
        }

        try {

            setLoading(true)

            // Clean Data
            const finalData = {
                expenseName: expenseName.trim(),
                amount: Number(amount),
                expenseDate,
                description: description.trim()
            }

            if (isEditing) {

                await dispatch(
                    updateTask({
                        id: taskToEdit.id,
                        taskData: finalData
                    })
                ).unwrap()

                toast.success(
                    'Expense Updated Successfully!'
                )

            } else {

                await dispatch(
                    createTask(finalData)
                ).unwrap()

                toast.success(
                    'Expense Added Successfully!'
                )
            }

            // Reset Form
            setFormData({
                expenseName: '',
                amount: '',
                expenseDate: '',
                description: ''
            })

            setErrors({})

            setTimeout(() => {
                navigate('/expenses-list')
            }, 1000)

        } catch (error) {

            console.log(error)

            toast.error(
                error?.message ||
                'Something went wrong!'
            )

        } finally {
            setLoading(false)
        }
    }

    return (

        <form
            onSubmit={handleSubmit}
            className='rounded-xl bg-white p-8 shadow-lg'
        >

            <h2 className='mb-8 text-center text-3xl font-bold text-gray-800'>
                {isEditing
                    ? 'Edit Expense'
                    : 'Add New Expense'}
            </h2>

            {/* Expense Name */}
            <div className='mb-5'>

                <label className='mb-2 block font-medium text-gray-700'>
                    Expense Name
                </label>

                <input
                    type='text'
                    name='expenseName'
                    value={expenseName}
                    onChange={onChange}
                    placeholder='Enter expense name'
                    maxLength={50}
                    className={`w-full rounded-lg border p-3 outline-none transition
                    ${errors.expenseName
                            ? 'border-red-500'
                            : 'border-gray-300 focus:border-green-500'
                        }`}
                />

                {errors.expenseName && (
                    <p className='mt-1 text-sm text-red-500'>
                        {errors.expenseName}
                    </p>
                )}

            </div>

            {/* Amount */}
            <div className='mb-5'>

                <label className='mb-2 block font-medium text-gray-700'>
                    Amount
                </label>

                <input
                    type='number'
                    name='amount'
                    value={amount}
                    onChange={onChange}
                    placeholder='Enter amount'
                    min='1'
                    max='1000000'
                    step='0.01'
                    className={`w-full rounded-lg border p-3 outline-none transition
                    ${errors.amount
                            ? 'border-red-500'
                            : 'border-gray-300 focus:border-green-500'
                        }`}
                />

                {errors.amount && (
                    <p className='mt-1 text-sm text-red-500'>
                        {errors.amount}
                    </p>
                )}

            </div>

            {/* Expense Date */}
            <div className='mb-5'>

                <label className='mb-2 block font-medium text-gray-700'>
                    Expense Date
                </label>

                <input
                    type='date'
                    name='expenseDate'
                    value={expenseDate}
                    onChange={onChange}
                    max={
                        new Date()
                            .toISOString()
                            .split('T')[0]
                    }
                    className={`w-full rounded-lg border p-3 outline-none transition
                    ${errors.expenseDate
                            ? 'border-red-500'
                            : 'border-gray-300 focus:border-green-500'
                        }`}
                />

                {errors.expenseDate && (
                    <p className='mt-1 text-sm text-red-500'>
                        {errors.expenseDate}
                    </p>
                )}

            </div>

            {/* Description */}
            <div className='mb-6'>

                <label className='mb-2 block font-medium text-gray-700'>
                    Description
                </label>

                <textarea
                    rows='4'
                    name='description'
                    value={description}
                    onChange={onChange}
                    placeholder='Enter description'
                    maxLength={300}
                    className={`w-full rounded-lg border p-3 outline-none transition
                    ${errors.description
                            ? 'border-red-500'
                            : 'border-gray-300 focus:border-green-500'
                        }`}
                />

                <div className='mt-1 flex items-center justify-between'>

                    {errors.description ? (
                        <p className='text-sm text-red-500'>
                            {errors.description}
                        </p>
                    ) : (
                        <p className='text-sm text-gray-400'>
                            Optional
                        </p>
                    )}

                    <span className='text-xs text-gray-400'>
                        {description.length}/300
                    </span>

                </div>

            </div>

            {/* Buttons */}
            <div className='flex gap-3'>

                <button
                    type='submit'
                    disabled={loading}
                    className='flex-1 rounded-lg bg-green-600 p-3 text-lg font-semibold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50'
                >

                    {
                        loading
                            ? (
                                isEditing
                                    ? 'Updating...'
                                    : 'Adding...'
                            )
                            : (
                                isEditing
                                    ? 'Update Expense'
                                    : 'Add Expense'
                            )
                    }

                </button>

                {isEditing && (

                    <button
                        type='button'
                        onClick={() =>
                            navigate('/expenses-list')
                        }
                        className='rounded-lg bg-gray-500 px-6 py-3 text-white transition hover:bg-gray-600'
                    >
                        Cancel
                    </button>

                )}

            </div>

        </form>
    )
}

export default ExpenseForm