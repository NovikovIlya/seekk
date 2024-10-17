import { Button } from 'antd'
import { setCurrentResponce } from '../../../../store/reducers/CurrentResponceSlice'
import {
	setCurrentRequisiteSeekerName,
	setCurrentRequisiteSeekerVacancy
} from '../../../../store/reducers/RequisiteReducers/RequisiteSeekerReducer'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { EmploymentStageItemType } from '../../../../store/reducers/type'

export const RequisiteItem = ( props : EmploymentStageItemType ) => {

	console.log(props.status)

	const navigate = useNavigate()
	const dispatch = useDispatch()

	return (
		<div className="flex flex-col">
			<div className="flex flex-row items-center h-[80px] w-full bg-[#FFFFFF]">
				<div className="flex ml-[1.5%] w-[30%]">
					{props.applicant.firstName + ' ' + props.applicant.middleName + ' ' + props.applicant.lastName}
				</div>
				<div className="flex w-[20%] mr-[10%]">
					{props.vacancy.name}
				</div>
				{props.status === 'REFINE' && (
					<div className="flex items-center w-[13.5%] gap-[12px]">
						<div className="w-[11px] h-[11px] rounded-[100%] bg-[#FFD600]"></div>
						<span>Доработка</span>
					</div>
				)}
				{props.status === 'VERIFYING' && (
					<div className="flex items-center w-[13.5%] gap-[12px]">
						<div className="w-[11px] h-[11px] rounded-[100%] bg-[#009DCE]"></div>
						<span>На проверке</span>
					</div>
				)}
				{props.status === 'COMPLETE' && (
					<div className="flex items-center w-[13.5%] gap-[12px]">
						<div className="w-[11px] h-[11px] rounded-[100%] bg-[#00AB30]"></div>
						<span>Принято</span>
					</div>
				)}
				<div className="flex ml-[5%] w-[20%] flex-row justify-between">
					<Button
						className='text-[#FFFFFF] py-[8px] px-[24px] border-none rounded-[54.5px] text-[16px] font-normal'
						type="primary"
						onClick={() => {
							dispatch(setCurrentResponce(props.respondId))
							dispatch(setCurrentRequisiteSeekerVacancy(props.vacancy.name))
							dispatch(setCurrentRequisiteSeekerName(props.applicant.firstName + ' ' + props.applicant.middleName + ' ' + props.applicant.lastName))
							navigate(`/services/personnelaccounting/requisite/requisite-review/info/${props.respondId}`)
						}}>
						Подробнее
					</Button>
				</div>
			</div>
		</div>
	)
}