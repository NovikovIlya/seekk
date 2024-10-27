import clsx from 'clsx'
import { forwardRef } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'

import { ArrowToTheRight } from '../../../assets/svg/ArrowToTheRight'
import { MessageReadSvg } from '../../../assets/svg/MessageReadSvg'
import { MessageUnreadSvg } from '../../../assets/svg/MessageUnreadSvg'
import { useAppSelector } from '../../../store'
import {
	useAnswerEmploymentRequestMutation,
	useAnswerToInivitationMainTimeMutation,
	useAnswerToInvitationReserveTimeRequestMutation
} from '../../../store/api/serviceApi'
import { useLazyGetVacancyViewQuery } from '../../../store/api/serviceApi'
import { setCurrentVacancy } from '../../../store/reducers/CurrentVacancySlice'
import { ChatMessageType } from '../../../store/reducers/type'

import { ChatMessageFile } from './ChatMessageFile'

type Props = { msgData: ChatMessageType } & { senderChange: boolean }
type Ref = HTMLDivElement

export const ChatMessage = forwardRef<Ref, Props>((props, ref) => {
	const { user } = useAppSelector(state => state.auth)
	const { vacancyTitle } = useAppSelector(state => state.currentVacancyName)
	const { respondId } = useAppSelector(state => state.respondId)
	const { currentVacancyId } = useAppSelector(state => state.currentVacancyId)
	const isSeeker = user?.roles[0].type === 'STUD'
	const isEmpDep = user?.roles.find(role => role.type === 'EMPL')

	const [answerMainTime] = useAnswerToInivitationMainTimeMutation()
	const [getVacancy, result] = useLazyGetVacancyViewQuery()

	const dispatch = useDispatch()
	const navigate = useNavigate()
	const [answerReserveTime] = useAnswerToInvitationReserveTimeRequestMutation()
	const [answerEmploymentRequest] = useAnswerEmploymentRequestMutation()

	return (
		<>
			{' '}
			<div
				ref={ref}
				className={clsx(
					'rounded-[16px] w-[50%] p-[20px] flex flex-col gap-[16px] font-content-font font-normal text-black text-[16px]/[19.2px]',
					{
						'self-start rounded-bl-none bg-white':
							(props.msgData.sender === 'SEEKER' && isEmpDep) ||
							(props.msgData.sender === 'PERSONNEL_DEPARTMENT' && !isEmpDep),
						'self-end rounded-br-none bg-[#4F6AFB1A] bg-opacity-10':
							(props.msgData.sender === 'SEEKER' && !isEmpDep) ||
							(props.msgData.sender === 'PERSONNEL_DEPARTMENT' && isEmpDep)
					},
					{
						'mt-[24px]': props.senderChange,
						'mt-[12px]': !props.senderChange
					},
					{
						'min-w-[50%]': props.msgData.type === 'RESPOND'
					}
				)}
			>
				{props.msgData.type === 'RESPOND' && (
					<div
						className="cursor-pointer"
						onClick={() => {
							getVacancy(currentVacancyId)
								.unwrap()
								.then(result => {
									dispatch(setCurrentVacancy(result))
									isEmpDep
										? navigate('/services/personnelaccounting/chat/vacancyview')
										: navigate('/services/myresponds/chat/vacancyview')
								})
						}}
					>
						<div className="flex items-center">
							<div>
								<p className="font-bold">Отклик на вакансию</p>
								<p>{vacancyTitle}</p>
							</div>
							<div className="ml-auto">
								<ArrowToTheRight />
							</div>
						</div>
						<div className="h-[1px] bg-black bg-opacity-[24%] mt-[16px]"></div>
					</div>
				)}
				<p className="whitespace-pre-line">{props.msgData.text}</p>
				{props.msgData.fileInfos && (
					<div className="flex flex-col gap-[8px]">
						{props.msgData.fileInfos.map(fileInfo => (
							<ChatMessageFile {...fileInfo} msgId={props.msgData.id} />
						))}
					</div>
				)}
				<div className="flex items-center gap-[12px]">
					<p className="ml-auto font-content-font font-normal text-black text-[12px]/[14.4px] opacity-[52%]">
						{props.msgData.sendDate.substring(11, 16)}
					</p>
					{(props.msgData.sender === 'SEEKER' && !isEmpDep) ||
					(props.msgData.sender === 'PERSONNEL_DEPARTMENT' && isEmpDep) ? (
						props.msgData.read ? (
							<MessageReadSvg />
						) : (
							<MessageUnreadSvg />
						)
					) : (
						<></>
					)}
				</div>
			</div>
			{props.msgData.type === 'INVITATION' && (
				<div
					className={clsx(
						'mt-[24px] w-[50%] grid grid-cols-2 grid-rows-[40px_40px] gap-[20px]',
						{
							'self-start':
								(props.msgData.sender === 'SEEKER' && isEmpDep) ||
								(props.msgData.sender === 'PERSONNEL_DEPARTMENT' && !isEmpDep),
							'self-end':
								(props.msgData.sender === 'SEEKER' && !isEmpDep) ||
								(props.msgData.sender === 'PERSONNEL_DEPARTMENT' && isEmpDep)
						}
					)}
				>
					<button
						onClick={() => {
							answerMainTime({ id: respondId, ans: 'YES' })
						}}
						className="rounded-[54.5px] bg-inherit outline-none border cursor-pointer"
					>
						Да
					</button>
					<button
						onClick={() => {
							answerMainTime({ id: respondId, ans: 'NO' })
						}}
						className="rounded-[54.5px] bg-inherit outline-none border cursor-pointer"
					>
						Не удобно
					</button>
					<button
						onClick={() => {
							answerMainTime({ id: respondId, ans: 'NOT_RELEVANT' })
						}}
						className="col-span-2 rounded-[54.5px] bg-inherit outline-none border cursor-pointer"
					>
						Вакансия не актуальна
					</button>
				</div>
			)}
			{(props.msgData.type === 'INVITATION_RESERVE') &&
				(props.msgData.reserveTimes !== null) && (
					<div className={clsx(
						'w-[50%] flex flex-col',
						{
							'self-start':
								(props.msgData.sender === 'SEEKER' && isEmpDep) ||
								(props.msgData.sender === 'PERSONNEL_DEPARTMENT' && !isEmpDep),
							'self-end':
								(props.msgData.sender === 'SEEKER' && !isEmpDep) ||
								(props.msgData.sender === 'PERSONNEL_DEPARTMENT' && isEmpDep)
						}
					)}>
						<div className="mt-[24px] w-[100%] flex flex-col gap-[14px]">
							<div className="flex flex-row justify-between gap-[14px] test:gap-[10px]">
								{props.msgData.reserveTimes.map(time => (
									<button
										onClick={() => {
											answerReserveTime({
												respondId: respondId,
												time: time
											})
										}}
										className="text-[16px]/[19.2px] rounded-[54.5px] py-[12px] px-[20px] text-center bg-inherit outline-none border cursor-pointer test:px-[12px]"
									>
										{time.substring(0, 10).split('-').reverse().join('.') +
											', ' +
											time.substring(11, 16)}
									</button>
								))}
							</div>
							<button
								onClick={() => {
									answerReserveTime({ respondId: respondId })
								}}
								className="text-[16px]/[19.2px]  rounded-[54.5px]  py-[12px] px-[56px] bg-inherit outline-none border cursor-pointer"
							>
								Нет подходящего времени
							</button>
						</div>
					</div>
				)}
			{props.msgData.type === 'EMPLOYMENT_REQUEST' && (
				<div className={clsx(
					'w-[50%] flex flex-col',
					{
						'self-start':
							(props.msgData.sender === 'SEEKER' && isEmpDep) ||
							(props.msgData.sender === 'PERSONNEL_DEPARTMENT' && !isEmpDep),
						'self-end':
							(props.msgData.sender === 'SEEKER' && !isEmpDep) ||
							(props.msgData.sender === 'PERSONNEL_DEPARTMENT' && isEmpDep)
					}
				)}>
					<div className="mt-[24px] w-[100%] flex flex-row gap-[20px]">
						<button
							onClick={() => {
								answerEmploymentRequest({ respondId: respondId, answer: 'YES' })
							}}
							className="w-6/12 text-[16px]/[19.2px] rounded-[54.5px]  text-center bg-inherit outline-none border cursor-pointer"
						>
							Да
						</button>
						<button
							onClick={() => {
								answerEmploymentRequest({ respondId: respondId, answer: 'NO' })
							}}
							className="w-6/12 text-[16px]/[19.2px] rounded-[54.5px] text-center py-[12px] bg-inherit outline-none border cursor-pointer"
						>
							Нет
						</button>
					</div>
				</div>
			)}
		</>
	)
})
