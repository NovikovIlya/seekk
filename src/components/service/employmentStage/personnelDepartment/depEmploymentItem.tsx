import { Button } from 'antd'
import { useNavigate } from 'react-router-dom'

interface DepEmploymentItemProps {
	status: string
}

export const DepEmploymentItem = (  props : DepEmploymentItemProps ) => {

	const navigate = useNavigate()

	return (
		<div className="flex flex-col mt-[16px]">
			<div className="flex flex-row items-center h-[80px] w-full bg-[#FFFFFF]">
				<div className="flex ml-[1.5%] w-[24%]">
					Алексеев Дмитрий Иванович
				</div>
				<div className="flex w-[20%] mr-[5%]">
					Специалист отдела развития сотрудничества
				</div>
				{props.status === 'revision' && (
					<div className="flex items-center w-[16%] gap-[12px]">
						<div className="w-[11px] h-[11px] rounded-[100%] bg-[#FFD600]"></div>
						<span>Доработка</span>
					</div>
				)}
				{props.status === 'oncheck' && (
					<div className="flex items-center w-[16%] gap-[12px]">
						<div className="w-[11px] h-[11px] rounded-[100%] bg-[#009DCE]"></div>
						<span>На проверке</span>
					</div>
				)}
				{props.status === 'accepted' && (
					<div className="flex items-center w-[16%] gap-[12px]">
						<div className="w-[11px] h-[11px] rounded-[100%] bg-[#00AB30]"></div>
						<span>Принято</span>
					</div>
				)}
				<div className="flex mr-[5%] w-[28.5%] flex-row justify-between">
					<Button
						className='text-[#FFFFFF] py-[8px] px-[24px] border-none rounded-[54.5px] text-[16px] font-normal'
						type="primary"
						onClick={() => {
							navigate('/services/personnelaccounting/employment/stages')
						}}>
						Подробнее
					</Button>
					<Button
						className='bg-[#FFFFFF] py-[8px] px-[24px] text-[#333333] border-[#333333] border-[1px] rounded-[54.5px] text-[16px] font-normal cursor-pointer'

					>
						Резюме
					</Button>
					<Button
						className='bg-[#FFFFFF] py-[8px] px-[24px] text-[#333333] border-[#333333] border-[1px] rounded-[54.5px] text-[16px] font-normal cursor-pointer'

					>
						Чат
					</Button>
				</div>
			</div>
		</div>
	)
}