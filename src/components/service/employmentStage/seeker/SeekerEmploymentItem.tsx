import { Button, ConfigProvider, Modal } from 'antd'
import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'

import {
	useGetChatIdByRespondIdQuery,
	useLazyGetEmploymentDataQuery
} from '../../../../store/api/serviceApi'
import {
	closeChat,
	openChat
} from '../../../../store/reducers/ChatRespondStatusSlice'
import { setStage } from '../../../../store/reducers/CurrentEmploymentStage'
import { setRespondId } from '../../../../store/reducers/CurrentRespondIdSlice'
import { setCurrentVacancyId } from '../../../../store/reducers/CurrentVacancyIdSlice'
import { setChatId } from '../../../../store/reducers/chatIdSlice'
import { RespondItemType, respondStatus } from '../../../../store/reducers/type'

export const SeekerEmploymentItem = (props: RespondItemType) => {
	const navigate = useNavigate()
	const dispatch = useDispatch()

	const [getEmpData, empDataStatus] = useLazyGetEmploymentDataQuery()

	const [isModalOpen, setIsModalOpen] = useState(false)
	const [comments, setComments] = useState<{ comment: string; type: string }[]>(
		[]
	)

	const {
		data: chatId = {
			id: 0,
			respondInfo: {},
			unreadCount: 0,
			lastMessageDate: ''
		},
		isLoading: isChatIdLoading
	} = useGetChatIdByRespondIdQuery({
		chatId: props.id,
		role: 'SEEKER'
	})

	const handleNavigate = (url: string) => {
		if (props.status) {
			if (
				props.status === respondStatus[respondStatus.INVITATION] ||
				props.status === respondStatus[respondStatus.EMPLOYMENT_REQUEST] ||
				props.status === respondStatus[respondStatus.EMPLOYMENT]
			) {
				dispatch(openChat())
			} else {
				dispatch(closeChat())
			}
		} else {
			dispatch(openChat())
		}
		dispatch(setChatId(chatId.id))
		dispatch(setRespondId(props.id))
		dispatch(setCurrentVacancyId(props.vacancyId))
		navigate(url)
	}

	useEffect(() => {
		if (props.employmentStageStatus === 'REFINE') {
			getEmpData(props.id)
				.unwrap()
				.then(data => {
					setComments(
						data.stages.map(stage => ({
							comment: stage.comment,
							type: stage.type
						}))
					)
				})
		}
	}, [])

	return (
		<>
			<ConfigProvider
				theme={{
					token: {
						boxShadow: '0 0 19px 0 rgba(212, 227, 241, 0.6)'
					}
				}}
			>
				<Modal
					centered
					open={isModalOpen}
					bodyStyle={{
						padding: '26px'
					}}
					className="pr-[52px] pl-[52px] pb-[52px]"
					footer={null}
					title={null}
					onCancel={() => {
						setIsModalOpen(false)
					}}
				>
					{empDataStatus.isLoading || empDataStatus.isFetching ? (
						<p>Loading</p>
					) : (
						comments.map(comm =>
							comm.comment ? (
								<div>
									<p>{comm.comment}</p>
									<a
										className="underline underline-offset-[3px]"
										onClick={() => {
											comm.type === 'SECOND'
												? dispatch(setStage(2))
												: comm.type === 'FOURTH'
												? dispatch(setStage(4))
												: dispatch(setStage(6))
											navigate(
												`/services/myresponds/employment/stages/${props.vacancyId}/${props.id}`
											)
										}}
									>
										{comm.type === 'SECOND'
											? 'Этап №2 «Прикрепление документов»'
											: comm.type === 'FOURTH'
											? 'Этап №4 «Медицинский осмотр»'
											: 'Этап №6 «Реквизиты»'}
									</a>
								</div>
							) : (
								<></>
							)
						)
					)}
				</Modal>
			</ConfigProvider>
			<div className="w-full mb-[12px] flex items-center bg-white shadow-custom-shadow pl-[20px] pr-[55px] pt-[20px] pb-[20px]">
				<p className="w-[30%]">{props.name}</p>
				{props.employmentStageStatus === 'FILLING' ? (
					<p className="ml-[10%]">Прохождение</p>
				) : props.employmentStageStatus === 'VERIFYING' ? (
					<p className="ml-[10%]">Проверка</p>
				) : (
					<p
						className="ml-[10%] underline underline-offset-[3px] pt-[3px] cursor-pointer"
						onClick={() => {
							setIsModalOpen(true)
						}}
					>
						Доработка
					</p>
				)}
				<div className="flex gap-[12px] ml-auto">
					<Button
						className="ml-[5%] rounded-[54px] font-content-font font-normal text-[16px]/[16px]"
						type="primary"
						onClick={() => {
							navigate(
								`/services/myresponds/employment/stages/${props.vacancyId}/${props.id}`
							)
						}}
					>
						Пройти этапы
					</Button>
					<Button
						onClick={() => {
							handleNavigate(`/services/myresponds/chat/id/${chatId.id}`)
						}}
						className="font-content-font font-normal text-black text-[16px]/[16px] rounded-[54.5px] py-[8px] px-[24px] border-black"
					>
						Перейти в чат
					</Button>
				</div>
			</div>
		</>
	)
}
