import { LoadingOutlined } from '@ant-design/icons'
import { Button, ConfigProvider, Modal, Spin, Tag } from 'antd'
import { useEffect, useRef, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { Margin, usePDF } from 'react-to-pdf'
import uuid from 'react-uuid'

import { AvatartandardSvg } from '../../../assets/svg/AvatarStandardSvg'
import { MyDocsSvg } from '../../../assets/svg/MyDocsSvg'
import { RespondDownload } from '../../../assets/svg/RespondDownload'
import { useAppSelector } from '../../../store'
import {
	useApproveReservedRespondMutation,
	useDeleteReserveRespondMutation,
	useGetChatIdByRespondIdQuery,
	useGetReservedResponcesQuery,
	useGetReservedRespondFullInfoQuery,
	useGetSeekerResumeFileQuery,
	useLazyGetSeekerResumeFileQuery
} from '../../../store/api/serviceApi'
import { openChat } from '../../../store/reducers/ChatRespondStatusSlice'
import { setRespondId } from '../../../store/reducers/CurrentRespondIdSlice'
import { setCurrentVacancyId } from '../../../store/reducers/CurrentVacancyIdSlice'
import { setChatId } from '../../../store/reducers/chatIdSlice'
import { NocircleArrowIcon } from '../jobSeeker/NoCircleArrowIcon'

import { ApproveRespondForm } from './ApproveRespondForm'
import { InviteSeekerForm } from './supervisor/InviteSeekerForm'

export const ReserveRespondInfo = (props: {
	type: 'PERSONNEL_DEPARTMENT' | 'SUPERVISOR'
}) => {
	const respondId = useAppSelector(state => state.currentResponce)

	const { data: res } = useGetReservedRespondFullInfoQuery(respondId.respondId)
	//const { data: resume } = useGetSeekerResumeFileQuery(respondId.respondId)
	const [getResume] = useLazyGetSeekerResumeFileQuery()
	const { refetch } = useGetReservedResponcesQuery('все')
	const [approveRespond] = useApproveReservedRespondMutation()
	const [deleteRespond] = useDeleteReserveRespondMutation()

	const [isRespondSentToSupervisor, setIsRespondSentToSupervisor] =
		useState<boolean>(res?.status === 'IN_SUPERVISOR_REVIEW')
	const [isModalOpen, setModalOpen] = useState(false)
	const [resume, setResume] = useState<string>('')
	const [resumeSize, setResumeSize] = useState<number>(0)

	//const linkRef = useRef<HTMLAnchorElement | null>(null)

	useEffect(() => {
		setIsRespondSentToSupervisor(res?.status === 'IN_SUPERVISOR_REVIEW')
	}, [res])

	useEffect(() => {
		getResume(respondId.respondId)
			.unwrap()
			.then(resume => {
				setResume(prev => resume.href)
				setResumeSize(prev => resume.size)
			})
	}, [])

	const navigate = useNavigate()

	const { toPDF, targetRef } = usePDF({
		filename:
			res?.userData?.lastname +
			' ' +
			res?.userData?.firstname +
			' ' +
			res?.userData?.middlename,
		page: {
			margin: Margin.SMALL
		}
	})

	const [buttonsHidden, setIsButtonsHidden] = useState<boolean>(false)

	const dispatch = useDispatch()

	const {
		data: chatId = {
			id: 0,
			respondInfo: {},
			unreadCount: 0,
			lastMessageDate: ''
		},
		isLoading: isChatIdLoading
	} = useGetChatIdByRespondIdQuery({
		chatId: res ? res.id : 0,
		role:
			props.type === 'PERSONNEL_DEPARTMENT' ? 'PERSONNEL_DEPARTMENT' : 'SEEKER'
	})

	const handleNavigate = (url: string) => {
		dispatch(openChat())
		dispatch(setChatId(chatId.id))
		dispatch(setRespondId(res?.id as number))
		dispatch(setCurrentVacancyId(res?.vacancyId as number))
		navigate(url)
	}

	if (res === undefined) {
		return (
			<>
				<div className="w-full h-full flex items-center">
					<div className="text-center ml-auto mr-auto">
						<Spin
							indicator={<LoadingOutlined style={{ fontSize: 36 }} spin />}
						></Spin>
						<p className="font-content-font font-normal text-black text-[18px]/[18px]">
							Идёт загрузка...
						</p>
					</div>
				</div>
			</>
		)
	} else {
		if (res.type === 'RESPOND') {
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
							bodyStyle={{ padding: 53 }}
							centered
							open={isModalOpen}
							onCancel={() => {
								setModalOpen(false)
							}}
							title={null}
							footer={null}
							width={407}
						>
							<p className="font-content-font font-normal text-black text-[16px]/[20px] text-center">
								Вы действительно хотите удалить отклик?
							</p>
							<div className="mt-[40px] flex gap-[12px]">
								<Button
									className="ml-auto"
									onClick={() => {
										setModalOpen(false)
									}}
								>
									Отменить
								</Button>
								<Button
									type="primary"
									className="rounded-[54.5px] mr-auto"
									onClick={() => {
										deleteRespond(respondId.respondId)
											.unwrap()
											.then(() => {
												refetch().then(() => {
													navigate('/services/personnelaccounting/reserve')
												})
											})
									}}
								>
									Удалить
								</Button>
							</div>
						</Modal>
					</ConfigProvider>
					<div className="pl-[52px] pr-[10%] py-[60px] mt-[60px] w-full">
						<div>
							<Button
								onClick={() => {
									props.type === 'PERSONNEL_DEPARTMENT'
										? navigate('/services/personnelaccounting/reserve')
										: navigate(
												'/services/personnelaccounting/supervisor/responds'
										  )
								}}
								className="bg-inherit h-[38px] pt-[12px] pb-[12px] pr-[16px] pl-[16px] rounded-[50px] border border-black cursor-pointer"
							>
								<NocircleArrowIcon />
								Назад
							</Button>
						</div>
						<div className="mt-[52px] flex flex-col gap-[36px]" ref={targetRef}>
							<div className="flex flex-wrap gap-[150px]">
								<div className="flex gap-[20px]">
									<div className="flex h-[167px] w-[167px] bg-[#D9D9D9]">
										<AvatartandardSvg />
									</div>
									<div className="flex flex-col gap-[8px]">
										<p className="font-content-font font-normal text-black text-[24px]/[28.8px]">
											{res?.userData?.lastname +
												' ' +
												res?.userData?.firstname +
												' ' +
												res?.userData?.middlename}
										</p>
										<p className="font-content-font font-normal text-black text-[16px]/[19.2px]">
											Мужчина, 21 год
										</p>
										<div className="flex gap-[36px]">
											<div className="flex flex-col gap-[8px]">
												<p className="font-content-font font-normal text-black text-[12px]/[14.4x] opacity-40">
													Дата рождения
												</p>
												<p className="font-content-font font-normal text-black text-[16px]/[19.2px]">
													16.05.2002
												</p>
											</div>
											<div className="flex flex-col gap-[8px]">
												<p className="font-content-font font-normal text-black text-[12px]/[14.4x] opacity-40">
													Страна гражданства
												</p>
												<p className="font-content-font font-normal text-black text-[16px]/[19.2px]">
													РФ
												</p>
											</div>
										</div>
										<div className="flex flex-col gap-[8px]">
											<p className="font-content-font font-normal text-black text-[12px]/[14.4x] opacity-40">
												Контакты:
											</p>
											<div className="flex gap-[24px]">
												<p className="font-content-font font-normal text-black text-[16px]/[19.2px]">
													{res?.userData?.phone}
												</p>
												<p className="font-content-font font-normal text-black text-[16px]/[19.2px]">
													{res?.userData?.email}
												</p>
											</div>
										</div>
									</div>
								</div>
								{props.type === 'PERSONNEL_DEPARTMENT' && (
									<div
										className={`self-center grid grid-cols-2 grid-rows-[40px_40px] gap-[12px] ${
											buttonsHidden && 'hidden'
										}`}
									>
										{/* <Button
											onClick={() => {
												approveRespond({
													respondId: respondId.respondId,
													vacancyId: 2
												})
													.unwrap()
													.then(() => {
														setIsRespondSentToSupervisor(true)
														refetch()
														navigate('/services/personnelaccounting/reserve')
													})
											}}
											disabled={isRespondSentToSupervisor}
											type="primary"
											className="font-content-font font-normal text-white text-[16px]/[16px] rounded-[54.5px] w-[224px] h-[40px] py-[8px] px-[24px]"
										>
											Отправить руководителю
										</Button> */}
										<ApproveRespondForm
											respondId={res.id}
											vacancyId={0}
											isRespondSentToSupervisor={isRespondSentToSupervisor}
											mode={res.type}
											callback={() => {
												setIsRespondSentToSupervisor(true)
											}}
										/>
										<Button
											onClick={() => {
												handleNavigate(
													`/services/personnelaccounting/chat/id/${chatId.id}`
												)
											}}
											className="bg-inherit font-content-font font-normal text-black text-[16px]/[16px] rounded-[54.5px] w-[224px] h-[40px] py-[8px] px-[24px] border-black"
										>
											Перейти в чат
										</Button>
										<Button
											disabled={isRespondSentToSupervisor}
											onClick={() => {
												setModalOpen(true)
											}}
											className="bg-inherit font-content-font font-normal text-black text-[16px]/[16px] rounded-[54.5px] w-[224px] h-[40px] py-[8px] px-[24px] border-black"
										>
											Удалить
										</Button>
										<Button
											onClick={() => {
												setIsButtonsHidden(true)
												setTimeout(() => {
													toPDF()
													setIsButtonsHidden(false)
												}, 0)
											}}
											className="bg-inherit font-content-font font-normal text-black text-[16px]/[16px] rounded-[54.5px] w-[224px] h-[40px] py-[8px] px-[24px] border-black"
										>
											<RespondDownload /> Скачать
										</Button>
									</div>
								)}
								{props.type === 'SUPERVISOR' && (
									<div className="self-center grid grid-cols-1 grid-rows-[40px_40px] gap-y-[12px]">
										<InviteSeekerForm
											respondId={respondId.respondId}
											isButtonDisabled
											callback={() => {}}
										/>
										<Button
											onClick={() => {}}
											className="bg-inherit font-content-font font-normal text-black text-[16px]/[16px] rounded-[54.5px] w-[257px] h-[40px] py-[8px] px-[24px] border-black"
										>
											Отказать
										</Button>
									</div>
								)}
							</div>
							<hr />
							<div className="flex flex-col gap-[24px]">
								<p className="font-content-font font-normal text-black text-[18px]/[21.6x] opacity-40">
									Сопроводительное письмо
								</p>
								<p className="font-content-font font-normal text-black text-[16px]/[19.2px]">
									{res.respondData.coverLetter}
								</p>
							</div>
							<hr />
							<div className="flex flex-col gap-[24px]">
								<p className="font-content-font font-normal text-black text-[18px]/[21.6x] opacity-40">
									Опыт работы
								</p>
								<div className="grid grid-cols-[194px_auto] gap-x-[20px] gap-y-[24px] w-[90%]">
									{res.respondData.portfolio.workExperiences.map(exp => (
										<>
											<div className="flex flex-col gap-[4px]">
												<p className="font-content-font font-normal text-black text-[16px]/[19.2px]">
													{exp.beginWork.substring(0, 4)}-
													{exp.endWork.substring(0, 4)}
												</p>
												<p className="font-content-font font-normal text-black text-[16px]/[19.2px]">
													{parseInt(exp.endWork.substring(0, 4)) -
														parseInt(exp.beginWork.substring(0, 4)) ===
													0
														? ''
														: parseInt(exp.endWork.substring(0, 4)) -
														  parseInt(exp.beginWork.substring(0, 4))}
													{parseInt(exp.endWork.substring(0, 4)) -
														parseInt(exp.beginWork.substring(0, 4)) ===
														1 && ' год'}
													{parseInt(exp.endWork.substring(0, 4)) -
														parseInt(exp.beginWork.substring(0, 4)) >=
														2 &&
														parseInt(exp.endWork.substring(0, 4)) -
															parseInt(exp.beginWork.substring(0, 4)) <=
															4 &&
														' года'}
													{parseInt(exp.endWork.substring(0, 4)) -
														parseInt(exp.beginWork.substring(0, 4)) >
														4 && ' лет'}
												</p>
											</div>
											<div className="flex flex-col gap-[8px]">
												<p className="font-content-font font-bold text-black text-[16px]/[19.2px]">
													{exp.position}
												</p>
												<p className="font-content-font font-normal text-black text-[16px]/[19.2px]">
													{exp.workPlace}
												</p>
												<p className="font-content-font font-normal text-black text-[14px]/[16.8px]">
													{exp.duties}
												</p>
											</div>
										</>
									))}
								</div>
								{res.respondData.portfolio.url !== '' && (
									<div className="grid grid-cols-[164px_auto] gap-x-[20px] gap-y-[24px] w-[90%]">
										<p>Ссылка на портфолио:</p>
										<a href={res.respondData.portfolio.url} target="_blank">
											{res.respondData.portfolio.url}
										</a>
									</div>
								)}
							</div>
							<hr />
							<div className="flex flex-col gap-[24px]">
								<p className="font-content-font font-normal text-black text-[18px]/[21.6x] opacity-40">
									Образование
								</p>
								{/* <div className="grid grid-cols-[194px_auto] gap-x-[20px] gap-y-[24px] w-[90%]">
									{res.educations.map(edu => (
										<>
											<p className="font-content-font font-normal text-black text-[16px]/[19.2px]">
												{edu.endYear}
											</p>
											<div className="flex flex-col gap-[8px]">
												<p className="font-content-font font-bold text-black text-[16px]/[19.2px]">
													{edu.nameOfInstitute}
												</p>
												<p className="font-content-font font-normal text-black text-[16px]/[19.2px]">
													{edu.speciality === null ? '' : edu.speciality + ', '}
													{edu.educationLevel}
												</p>
											</div>
										</>
									))}
								</div> */}
							</div>
							<hr />
							<div className="flex flex-col gap-[24px]">
								<p className="font-content-font font-normal text-black text-[18px]/[21.6x] opacity-40">
									О себе
								</p>
								<p className="font-content-font font-normal text-black text-[16px]/[19.2px]">
									{res.respondData.skills.aboutMe}
								</p>
							</div>
							<hr />
							<div className="flex flex-col">
								<p className="font-content-font font-normal text-black text-[18px]/[21.6x] opacity-40 w-[194px]">
									Профессиональные навыки
								</p>
								<div className="grid grid-cols-[194px_auto] gap-x-[20px] w-[90%]">
									<div className="col-start-2 mt-[111px] flex gap-[8px] flex-wrap">
										{res.respondData.skills.keySkills.map(skill => (
											<Tag
												className="bg-black bg-opacity-10 rounded-[40px] py-[8px] px-[16px] font-content-font font-normal text-black text-[16px]/[19.2px]"
												key={uuid()}
											>
												{skill}
											</Tag>
										))}
									</div>
								</div>
							</div>
						</div>
					</div>
				</>
			)
		} else {
			return (
				<>
					<div className="pl-[52px] pr-[10%] py-[60px] w-full mt-[60px]">
						<div>
							<Button
								onClick={() => {
									props.type === 'PERSONNEL_DEPARTMENT'
										? navigate('/services/personnelaccounting/reserve')
										: navigate(
												'/services/personnelaccounting/supervisor/responds'
										  )
								}}
								className="bg-inherit h-[38px] pt-[12px] pb-[12px] pr-[16px] pl-[16px] rounded-[50px] border border-black cursor-pointer"
							>
								<NocircleArrowIcon />
								Назад
							</Button>
						</div>
						<div className="mt-[52px] flex flex-col gap-[36px]">
							<div className="flex flex-wrap gap-[150px]">
								<div className="flex gap-[20px]">
									<div className="flex h-[167px] w-[167px] bg-[#D9D9D9]">
										<AvatartandardSvg />
									</div>
									<div className="flex flex-col gap-[8px]">
										<p className="font-content-font font-normal text-black text-[24px]/[28.8px]">
											{res?.userData?.lastname +
												' ' +
												res?.userData?.firstname +
												' ' +
												res?.userData?.middlename}
										</p>
										<div className="flex flex-col gap-[8px]">
											<p className="font-content-font font-normal text-black text-[12px]/[14.4x] opacity-40">
												Контакты:
											</p>
											<div className="flex gap-[24px]">
												<p className="font-content-font font-normal text-black text-[16px]/[19.2px]">
													{res?.userData?.phone}
												</p>
												<p className="font-content-font font-normal text-black text-[16px]/[19.2px]">
													{res?.userData?.email}
												</p>
											</div>
										</div>
									</div>
								</div>
								{props.type === 'PERSONNEL_DEPARTMENT' && (
									<div className="self-center flex flex-col gap-[12px]">
										{/* <Button
											onClick={() => {
												approveRespond({
													respondId: respondId.respondId,
													vacancyId: 2
												})
													.unwrap()
													.then(() => {
														setIsRespondSentToSupervisor(true)
														refetch()
														navigate('/services/personnelaccounting/reserve')
													})
											}}
											disabled={isRespondSentToSupervisor}
											type="primary"
											className="font-content-font font-normal text-white text-[16px]/[16px] rounded-[54.5px] w-[224px] h-[40px] py-[8px] px-[24px]"
										>
											Отправить руководителю
										</Button> */}
										<ApproveRespondForm
											respondId={res.id}
											vacancyId={0}
											isRespondSentToSupervisor={false}
											mode={res.type}
											callback={() => {
												setIsRespondSentToSupervisor(true)
											}}
										/>
										<Button
											onClick={() => {}}
											className="bg-inherit font-content-font font-normal text-black text-[16px]/[16px] rounded-[54.5px] w-[224px] h-[40px] py-[8px] px-[24px] border-black"
										>
											Перейти в чат
										</Button>
										<Button
											onClick={() => {
												deleteRespond(respondId.respondId)
													.unwrap()
													.then(() => {
														refetch()
														navigate('/services/personnelaccounting/reserve')
													})
											}}
											className="bg-inherit font-content-font font-normal text-black text-[16px]/[16px] rounded-[54.5px] w-[224px] h-[40px] py-[8px] px-[24px] border-black"
										>
											Удалить
										</Button>
									</div>
								)}
							</div>
							<hr />
							<div className="flex flex-col gap-[24px]">
								<div className="grid grid-cols-[194px_auto] gap-x-[20px] gap-y-[24px] w-[90%]">
									<p className="font-content-font font-normal text-black text-[16px]/[19.2px]">
										Желаемая должность
									</p>
									<p className="font-content-font font-bold text-black text-[16px]/[19.2px]">
										{res?.desiredJob}
									</p>
								</div>
							</div>
							<hr />
							<div className="flex flex-col gap-[24px]">
								<div className="grid grid-cols-[194px_auto] gap-x-[20px] gap-y-[24px] w-[90%]">
									<p className="font-content-font font-normal text-black text-[16px]/[19.2px]">
										Резюме
									</p>
									<div className="bg-white rounded-[16px] shadow-custom-shadow h-[59px] w-[65%] p-[20px] flex">
										<MyDocsSvg />
										<p
											className="ml-[20px] font-content-font font-normal text-black text-[16px]/[19.2px] underline cursor-pointer"
											onClick={() => {
												const link = document.createElement('a')
												link.href = resume
												link.download = 'Резюме'
												link.click()
											}}
										>
											{'Резюме ' +
												res.userData?.lastname +
												' ' +
												res.userData?.firstname +
												' ' +
												res.userData?.middlename}
										</p>
										<p className="ml-auto font-content-font font-normal text-black text-[16px]/[19.2px] opacity-70">
											{resumeSize}
										</p>
									</div>
								</div>
							</div>
						</div>
					</div>
				</>
			)
		}
	}
}
