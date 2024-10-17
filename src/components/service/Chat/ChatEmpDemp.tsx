import { LoadingOutlined } from '@ant-design/icons'
import { Button, ConfigProvider, Select, Spin } from 'antd'
import { useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'

import { ChatCrossIcon } from '../../../assets/svg/ChatCrossIcon'
import { ChatFilterIcon } from '../../../assets/svg/ChatFilterIcon'
import {
	useGetAllVacanciesQuery,
	useGetSeekerRespondsQuery,
	useGetVacancyGroupedResponcesQuery,
	useLazyGetChatPreviewsQuery,
	useLazyGetResponcesByVacancyQuery,
	useLazyGetVacancyGroupedResponcesQuery
} from '../../../store/api/serviceApi'
import { VacancyRespondItemType } from '../../../store/reducers/type'
import VacancyView from '../jobSeeker/VacancyView'

import { ChatEmpDempPreview } from './ChatEmpDempPreview'
import { ChatPage } from './ChatPage'
import { ChatPreview } from './ChatPreview'

const seekerToken =
	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJJQU1pdHJvZmFub3ZAc3R1ZC5rcGZ1LnJ1IiwiaWF0IjoxNzExNTc3OTMwLCJleHAiOjE3MTE1ODg3MzAsInNjb3BlIjoidXNlciIsInJvbGVzIjpbeyJ1c2VySWQiOiI2Iiwic2Vzc2lvbklkIjoiMjQwMzIyNzE0ODc1MTk0ODI5NzMzMDkwNDczNTM2NjciLCJzZXNzaW9uSGFzaCI6IkQyQTIyNUE3NDk5RjFDRTE2Q0JFMDJCOUY2QzkxN0UxIiwiZG9jdW1lbnRzSGFzaCI6IkIyNkNCMEMzRThBQzM2RDZBMENCNTEyQ0YzMDIzNzc3IiwibG9naW4iOiJJQU1pdHJvZmFub3YiLCJ0eXBlIjoiU0VFS0VSIn1dLCJzZXNzaW9uSWQiOiIyNDAzMjI3MTQ4NzUxOTQ4Mjk3MzMwOTA0NzM1MzY2NyIsInNlc3Npb25IYXNoIjoiRDJBMjI1QTc0OTlGMUNFMTZDQkUwMkI5RjZDOTE3RTEiLCJhbGxJZCI6IjE3ODQ0MCIsImVtYWlsIjoibWl0cm9fMDJAbWFpbC5ydSJ9.rbdEbs6b2NVFyFa65GW5rpy8VBd7TKpNxaTrVBMh5i0'
const personnelDeparmentToken =
	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJTdWJCQXNhZHVsbG9ldkBzdHVkLmtwZnUucnUiLCJpYXQiOjE3MTE3MjQ1NDQsImV4cCI6MTcxMTczNTM0NCwic2NvcGUiOiJ1c2VyIiwicm9sZXMiOlt7InVzZXJJZCI6IjciLCJzZXNzaW9uSWQiOiIyNDA0NzM4MTc3NzI3MjIwMTMzMDkwNzU0ODQ2ODU5MSIsInNlc3Npb25IYXNoIjoiNTZEMTZENTNDOTc5MDk5MTk0QTY4OEY4Qjk0M0I0N0MiLCJkb2N1bWVudHNIYXNoIjoiQTdCMkI0MUU4MjQ4NDYzNkY2ODZDNTQ3NEY0NEREMjYiLCJsb2dpbiI6IlNCQXNhZHVsbG9ldiIsInR5cGUiOiJQRVJTT05ORUxfREVQQVJUTUVOVCJ9LHsidXNlcklkIjoiMzQ4NTQxIiwic2Vzc2lvbklkIjoiMjQwNDczODA1NjYxMjc2MDM3NTM5NjI3MjY1MTM0OTQiLCJzZXNzaW9uSGFzaCI6IkUzQUZFMTUzNUVCMTU3NEUyMkZCNUJDNEYxNUFERkUwIiwiZG9jdW1lbnRzSGFzaCI6IiIsImxvZ2luIjoiU3ViQkFzYWR1bGxvZXYiLCJ0eXBlIjoiRU1QTCJ9LHsidXNlcklkIjoiMzM2MDM3Iiwic2Vzc2lvbklkIjoiMjQwNDczODI0NDUwMjI3MTM5NzgzNzQ5OTMwNjk4MDciLCJzZXNzaW9uSGFzaCI6IjcxMEExMTFFM0FCN0Q4NDczNTVFOEM0QkUxMDI4RTZBIiwiZG9jdW1lbnRzSGFzaCI6IkEyMkE3NURCRTBBNzg4MDE4OTY4NjZCQjgzNUIxNDQxIiwibG9naW4iOiJTdUJBc2FkdWxsb2V2IiwidHlwZSI6IlNUVUQifV0sInNlc3Npb25JZCI6IjI0MDQ3MzgxNzc3MjcyMjAxMzMwOTA3NTQ4NDY4NTkxIiwic2Vzc2lvbkhhc2giOiI1NkQxNkQ1M0M5NzkwOTkxOTRBNjg4RjhCOTQzQjQ3QyIsImFsbElkIjoiMjM5MTc0IiwiZW1haWwiOiJCYXN1YmhvbmJla0BnbWFpbC5jb20ifQ.MMK47Gd4AKG8tPzmPAwgNq79zVEmfzdFCuoZjcXeW_o'

export const ChatEmpDemp = () => {
	const [isFilterWindowOpen, setIsFilterWindowOpen] = useState<boolean>(false)

	const [requestData, setRequestData] = useState<{
		vacancyId: number | null
		status: string | null
		sort: 'ALL' | 'UNREAD' | null
		page: number
		pageSize: number
	}>({ vacancyId: null, status: null, sort: null, page: 0, pageSize: 10 })

	// const [getResponds] = useLazyGetResponcesByVacancyQuery()
	// const [responds, setResponds] = useState<VacancyRespondItemType[]>([])
	// const [getGroupedResponds] = useLazyGetVacancyGroupedResponcesQuery()

	const [blockPageAddition, setBlockPageAddition] = useState<boolean>(true)
	const [isBottomOfChatPreviewsVisible, setIsBottomOfChatPreviewsVisible] =
		useState<boolean>(true)
	const chatPreviewsBottomRef = useRef<null | HTMLDivElement>(null)

	const [chats, setChats] = useState<
		{
			id: number
			respondInfo: VacancyRespondItemType
			unreadCount: number
			lastMessageDate: string
		}[]
	>([])

	const [getChatPreviews, chatPreviewsQueryState] =
		useLazyGetChatPreviewsQuery()
	const { data: vacancies = [] } = useGetAllVacanciesQuery()

	useEffect(() => {
		const lowerObserver = new IntersectionObserver(entries => {
			const target = entries[0]
			if (target.isIntersecting) {
				console.log('I see the depths of hell below')
				setIsBottomOfChatPreviewsVisible(true)
			}
			if (!target.isIntersecting) {
				setIsBottomOfChatPreviewsVisible(false)
			}
		})

		if (chatPreviewsBottomRef.current) {
			lowerObserver.observe(chatPreviewsBottomRef.current)
		}

		return () => {
			if (chatPreviewsBottomRef.current) {
				lowerObserver.unobserve(chatPreviewsBottomRef.current)
			}
		}
	}, [chats.length])

	useEffect(() => {
		if (requestData.page === 0) {
			getChatPreviews({
				vacancyId: requestData.vacancyId,
				status: requestData.status,
				sort: requestData.sort,
				page: requestData.page,
				pageSize: requestData.pageSize
			})
				.unwrap()
				.then(res => {
					setChats(res)
					setBlockPageAddition(false)
				})
		} else {
			getChatPreviews({
				vacancyId: requestData.vacancyId,
				status: requestData.status,
				sort: requestData.sort,
				page: requestData.page,
				pageSize: requestData.pageSize
			})
				.unwrap()
				.then(res => {
					setChats(prev => [...prev, ...res])
					setBlockPageAddition(false)
				})
		}
	}, [requestData])

	useEffect(() => {
		if (isBottomOfChatPreviewsVisible) {
			if (!blockPageAddition) {
				setRequestData(prev => ({ ...prev, page: prev.page + 1 }))
			}
		}
	}, [isBottomOfChatPreviewsVisible])

	// useEffect(() => {
	// 	getGroupedResponds({ category: 'АУП', role: 'PERSONNEL_DEPARTMENT' })
	// 		.unwrap()
	// 		.then(grData => {
	// 			grData.map(vacResp => {
	// 				getResponds({
	// 					id: vacResp.vacancyId,
	// 					status: '',
	// 					role: 'PERSONNEL_DEPARTMENT'
	// 				})
	// 					.unwrap()
	// 					.then(data => setResponds(prev => [...prev, ...data]))
	// 			})
	// 		})
	// }, [])

	const { pathname } = useLocation()

	const handleList = chats.map(chat => {
		return (
			// <ChatPreview
			// 	respondId={chat.id}
			// 	vacancyId={chat.respondInfo.id}
			// 	respName={chat.respondInfo.vacancyName}
			// 	key={chat.id}
			// />
			<ChatEmpDempPreview
				chatId={chat.id}
				vacancyId={chat.respondInfo.vacancyId}
				respName={chat.respondInfo.vacancyName}
				surname="Митрофанов"
				name="Илья"
				status={chat.respondInfo.status}
				unreadCount={chat.unreadCount}
				lastMessageDate={chat.lastMessageDate}
			/>
		)
	})

	return (
		<>
			{' '}
			<div className="bg-[#F5F8FB] flex w-full">
				{!pathname.includes(
					'/services/personnelaccounting/chat/vacancyview'
				) && (
					<div className="shadowNav bg-white relative z-[5] mt-[60px] w-[461px]">
						<div className="sticky top-[80px] h-full overflow-scroll">
							<div className="flex items-center px-[30px] pt-14 pb-[40px]">
								<p className="font-content-font font-normal text-black text-[20px]/[20px] ">
									Все сообщения
								</p>
								<ConfigProvider
									theme={{ components: { Button: { textHoverBg: '#ffffff' } } }}
								>
									<Button
										type="text"
										onClick={() => {
											setIsFilterWindowOpen(prev => !prev)
										}}
										className="ml-auto underline font-content-font font-normal text-[14px]/[14px] text-black opacity-60 !px-0"
									>
										<ChatFilterIcon />
										Скрыть
									</Button>
								</ConfigProvider>
							</div>
							{isFilterWindowOpen && (
								<>
									<div className="px-[30px] pt-[20px] pb-[40px] flex flex-col gap-[20px] w-full">
										<div className="flex flex-col gap-[8px]">
											<p className="font-content-font font-normal text-[14px]/[14px] text-black opacity-80">
												Вакансия
											</p>
											<Select
												options={vacancies.map(vac => ({
													value: vac.id,
													label: vac.post
												}))}
												value={requestData.vacancyId}
												onChange={value =>
													setRequestData(prev => ({
														...prev,
														vacancyId: value,
														page: 0
													}))
												}
												className="w-full h-[40px]"
												placeholder="Выбрать"
											/>
										</div>
										<div className="flex flex-col gap-[8px]">
											<p className="font-content-font font-normal text-[14px]/[14px] text-black opacity-80">
												Статус отклика
											</p>
											<Select
												options={[
													{
														value: 'IN_PERSONNEL_DEPT_REVIEW',
														label: 'На рассмотрении'
													},
													{
														value: 'IN_SUPERVISOR_REVIEW',
														label: 'На рассмотрении у руководителя'
													},
													{
														value: 'INVITATION',
														label: 'Приглашение'
													},
													{
														value: 'EMPLOYMENT',
														label: 'Трудоустройство'
													},
													{
														value: 'IN_RESERVE',
														label: 'Резерв'
													},
													{
														value: 'ARCHIVE',
														label: 'Отказ'
													}
												]}
												value={requestData.status}
												onChange={value => {
													setRequestData(prev => ({
														...prev,
														status: value,
														page: 0
													}))
												}}
												className="w-full h-[40px]"
												placeholder="Выбрать"
											/>
										</div>
										<div className="flex items-center gap-[12px] w-full">
											<p className="font-content-font font-normal text-[14px]/[14px] text-black opacity-80">
												Сортировка
											</p>
											<Select
												options={[
													{ value: 'ALL', label: 'Все' },
													{ value: 'UNREAD', label: 'Непрочитанные' }
												]}
												value={requestData.sort}
												onChange={value => {
													setRequestData(prev => ({
														...prev,
														sort: value,
														page: 0
													}))
												}}
												className="w-[40%] h-[32px]"
												placeholder="Все"
											/>
											<Button
												onClick={() => {
													setRequestData(prev => ({
														vacancyId: null,
														status: null,
														sort: null,
														page: 0,
														pageSize: 10
													}))
												}}
												type="text"
												className="ml-auto !pr-0 !pl-0 font-content-font font-normal text-[14px]/[14px] text-black"
											>
												Сбросить <ChatCrossIcon />
											</Button>
										</div>
									</div>
								</>
							)}
							{chatPreviewsQueryState.isFetching ||
							chatPreviewsQueryState.isLoading ? (
								<>
									<div className="flex items-center">
										<div className="text-center ml-auto mr-auto mb-[10%]">
											<Spin
												indicator={
													<LoadingOutlined style={{ fontSize: 36 }} spin />
												}
											></Spin>
											<p className="font-content-font font-normal text-black text-[18px]/[18px]">
												Идёт загрузка...
											</p>
										</div>
									</div>
								</>
							) : (
								<ul className="flex flex-col">{handleList}</ul>
							)}
							<div className="h-[1px]" ref={chatPreviewsBottomRef}></div>
						</div>
					</div>
				)}
				{pathname.match('services/personnelaccounting/chat/id/*') && (
					<ChatPage />
				)}
				{pathname.includes(
					'/services/personnelaccounting/chat/vacancyview'
				) && <VacancyView type="CHAT" />}
			</div>
		</>
	)
}
