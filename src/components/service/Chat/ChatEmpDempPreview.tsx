import { Badge } from 'antd'
import clsx from 'clsx'
import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { useLocation, useNavigate } from 'react-router-dom'

import { AvatartandardSvg } from '../../../assets/svg/AvatarStandardSvg'
import { useAppSelector } from '../../../store'
import {
	useGetChatIdByRespondIdQuery,
	useGetUnreadMessagesCountQuery
} from '../../../store/api/serviceApi'
import {
	closeChat,
	openChat
} from '../../../store/reducers/ChatRespondStatusSlice'
import { setRespondId } from '../../../store/reducers/CurrentRespondIdSlice'
import { setCurrentVacancyId } from '../../../store/reducers/CurrentVacancyIdSlice'
import { setCurrentVacancyName } from '../../../store/reducers/CurrentVacancyNameSlice'
import { setChatId } from '../../../store/reducers/chatIdSlice'
import {
	ChatMessageDateDisplayEnum,
	respondStatus
} from '../../../store/reducers/type'

export const ChatEmpDempPreview = (props: {
	chatId: number
	vacancyId: number
	respName: string
	surname: string
	name: string
	status: string
	unreadCount: number
	checkableStatus?: string
	lastMessageDate: string
}) => {
	const user = useAppSelector(state => state.auth.user)
	const isEmpDemp = user?.roles.find(role => role.type === 'EMPL')

	const { pathname } = useLocation()
	const dispatch = useDispatch()
	const navigate = useNavigate()

	const handleNavigate = (url: string) => {
		dispatch(setChatId(props.chatId))
		//dispatch(setRespondId(props.respondId))
		dispatch(setCurrentVacancyId(props.vacancyId))
		navigate(url)
	}

	const [isChatOpen, setIsChatOpen] = useState<boolean>(false)

	return (
		<>
			<li
				className={clsx(
					'w-full flex items-center hover:bg-[#F5F8FB]  cursor-pointer',
					pathname.includes(props.chatId.toString()) && 'bg-[#F5F8FB]'
				)}
				onClick={() => {
					dispatch(setCurrentVacancyName(props.respName))
					handleNavigate(
						isEmpDemp
							? `/services/personnelaccounting/chat/id/${props.chatId}`
							: `/services/myresponds/chat/id/${props.chatId}`
					)
					setIsChatOpen(true)
				}}
			>
				<div className="w-full flex flex-col gap-[10px] py-[12px] px-[30px]">
					<div className="w-full flex gap-[16px]">
						<div className="flex h-[48px] w-[48px] bg-[#D9D9D9] rounded-[40px] px-[16px] items-center">
							<AvatartandardSvg />
						</div>
						<div className="w-[60%] flex flex-col gap-[16px]">
							<p className="font-content-font font-bold text-[16px]/[19.2px] text-black">
								{props.surname + ' ' + props.name}
							</p>
							<p className="font-content-font font-normal text-[16px]/[19.2px] text-black opacity-80 whitespace-nowrap text-ellipsis overflow-hidden">
								{props.respName}
							</p>
							<p
								className={`font-content-font font-normal text-[16px]/[19.2px] ${
									props.status === 'INVITATION'
										? 'text-[#00AB30]'
										: props.status === 'ARCHIVE' ||
										  props.status === 'IN_RESERVE'
										? 'text-[#D40000]'
										: 'text-[#1F5CB8]'
								}`}
							>
								{props.status === 'INVITATION'
									? 'Приглашение'
									: props.status === 'ARCHIVE' || props.status === 'IN_RESERVE'
									? 'Отказ'
									: 'На рассмотрении'}
							</p>
						</div>
						<div className="flex flex-col ml-auto">
							{props.lastMessageDate && (
								<p className=" font-content-font font-normal text-black text-[12px]/[14.4px] opacity-[52%]">
									{props.lastMessageDate.substring(8, 10) +
										' ' +
										ChatMessageDateDisplayEnum[
											parseInt(props.lastMessageDate.substring(5, 7)) - 1
										].substring(0, 3) +
										' ' +
										props.lastMessageDate.substring(11, 16)}
								</p>
							)}

							{props.unreadCount !== 0 && !isChatOpen && (
								<Badge
									className="ml-auto mt-[4px]"
									count={props.unreadCount}
									size="default"
									color="#D40000"
								/>
							)}
						</div>
					</div>
					<hr className="opacity-60 -mb-[12px]" />
				</div>
			</li>
		</>
	)
}
