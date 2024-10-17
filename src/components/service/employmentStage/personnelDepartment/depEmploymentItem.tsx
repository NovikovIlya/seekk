import { Button } from 'antd'
import { useNavigate } from 'react-router-dom'
import { FileIconSvg } from "../../../../assets/svg/FileIconSvg"
import { setCurrentResponce } from '../../../../store/reducers/CurrentResponceSlice'
import {
	useGetChatIdByRespondIdQuery
} from '../../../../store/api/serviceApi'
import { useDispatch } from 'react-redux'
import { EmploymentStageItemType } from '../../../../store/reducers/type'
import {
	setCurrentEmploymentSeekerName,
	setCurrentEmploymentSeekerVacancy
} from '../../../../store/reducers/EmploymentStageReducers/EmploymentStageSeekerReducer'

export const DepEmploymentItem = (  props : EmploymentStageItemType ) => {

	const dispatch = useDispatch()
	const navigate = useNavigate()

	const {
		data: chatId = {
			id: 0,
			respondInfo: {},
			unreadCount: 0,
			lastMessageDate: ''
		},
		isLoading: isChatIdLoading
	} = useGetChatIdByRespondIdQuery({
		chatId: props.respondId,
		role: 'PERSONNEL_DEPARTMENT'
	})
	console.log(props.status)
	return (
		<div className="flex flex-col">
			<div className="flex flex-row items-center h-[80px] w-full bg-[#FFFFFF]">
				<div className="flex ml-[1.5%] w-[24%]">
					{props.applicant.firstName + ' ' + props.applicant.middleName + ' ' + props.applicant.lastName}
				</div>
				<div className="flex w-[20%] mr-[5%]">
					{props.vacancy.name}
				</div>
				{props.status === 'REFINE' && (
					<div className="flex items-center w-[16%] gap-[12px]">
						<div className="w-[11px] h-[11px] rounded-[100%] bg-[#FFD600]"></div>
						<span>Доработка</span>
					</div>
				)}
				{props.status === 'VERIFYING' && (
					<div className="flex items-center w-[16%] gap-[12px]">
						<div className="w-[11px] h-[11px] rounded-[100%] bg-[#009DCE]"></div>
						<span>На проверке</span>
					</div>
				)}
				{props.status === 'COMPLETE' && (
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
							dispatch(setCurrentResponce(props.respondId))
							dispatch(setCurrentEmploymentSeekerVacancy(props.vacancy.name))
							dispatch(setCurrentEmploymentSeekerName(props.applicant.firstName + ' ' + props.applicant.middleName + ' ' + props.applicant.lastName))
							navigate(`/services/personnelaccounting/employment/stages/${props.respondId}`)
						}}>
						Подробнее
					</Button>
					<Button
						className='bg-[#FFFFFF] py-[8px] px-[24px] text-[#333333] border-[#333333] border-[1px] rounded-[54.5px] text-[16px] font-normal cursor-pointer'
						onClick={() => {
							dispatch(setCurrentResponce(props.respondId))
							navigate(`/services/personnelaccounting/employment/stages/${props.respondId}/seekerinfo`)
						}}
					>
						Резюме
					</Button>
					<Button
						className='bg-[#FFFFFF] py-[8px] px-[24px] text-[#333333] border-[#333333] border-[1px] rounded-[54.5px] cursor-pointer'
						onClick={() => {
							navigate(`/services/personnelaccounting/chat/id/${chatId.id}`)
						}}
					>
						<FileIconSvg></FileIconSvg>
						<span className='text-[16px] font-normal'>Чат</span>
					</Button>
				</div>
			</div>
		</div>
	)
}