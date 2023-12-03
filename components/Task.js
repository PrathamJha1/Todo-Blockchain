import { BsFillTrashFill } from 'react-icons/bs'

const Task = ({taskText,deleteTasks,id}) => {
  return (
    <div className='flex items-center text-white' key={id}>
      <div className=' bg-[#031956] text-[#b6c7db] flex w-[70%] rounded-[15px] mb-[10px] flex-1'>
        <div className='flex items-center justify-between w-full p-[20px] text-xl'>
        {taskText}
        </div>
      </div>
      <BsFillTrashFill
        className='text-2xl cursor-pointer ml-10'
        onClick={deleteTasks}
      />
    </div>
  )
}

export default Task
