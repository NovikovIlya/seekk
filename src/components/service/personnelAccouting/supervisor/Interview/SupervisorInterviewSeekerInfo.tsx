import { Button, ConfigProvider, Form, Modal, Select } from 'antd'
import { useState } from 'react'

import { AvatartandardSvg } from '../../../../../assets/svg/AvatarStandardSvg'
import { useAppSelector } from '../../../../../store'
import {
	useEmployeeSeekerRequestMutation,
	useGetRespondFullInfoQuery
} from '../../../../../store/api/serviceApi'
import { NocircleArrowIcon } from '../../../jobSeeker/NoCircleArrowIcon'

export const SupervisorInterviewSeekerInfo = () => {
	const respondId = useAppSelector(state => state.currentResponce)
	const format = useAppSelector(state => state.currentInterviewFormat)
	const time = useAppSelector(state => state.currentInterviewTime)
	const timeFormated = useAppSelector(
		state => state.currentInterviewTimeFormated
	)

	const { data } = useGetRespondFullInfoQuery(respondId.respondId)

	const [isRefuseModalOpen, setIsRefuseModalOpen] = useState(false)

	const [isUnsuccessModalOpen, setIsUnsuccessModalOpen] = useState(false)

	const [rejectSeeker] = useEmployeeSeekerRequestMutation()
	const [aproveSeeker] = useEmployeeSeekerRequestMutation()

	const [isEmploymentRequestSent, setIsEmploymentRequestSent] =
		useState<boolean>(false)
	const [isSeekerRejected, setIsSeekerRejected] = useState<boolean>(false)

	interface ComponentProps {
		time: string
		timeFormated: string
		format: string
	}

	const Component = (props: ComponentProps) => {
		const targetDate = new Date(props.time)
		const now = new Date()
		const difference = targetDate.getTime() - now.getTime()
		let isInterviewStarted: boolean = false
		let is5MinBeforeInterviewStarted: boolean = false
		let is30MinAfterInterviewEnded: boolean = false

		if (difference < 0) {
			isInterviewStarted = true
		} else {
			isInterviewStarted = false
		}

		if (difference > 0 && difference <= 60 * 1000 * 5) {
			// 5 мин
			is5MinBeforeInterviewStarted = true
		} else {
			is5MinBeforeInterviewStarted = false
		}

		if (difference * -1 < 60 * 1000 * 30) {
			is30MinAfterInterviewEnded = false
		} else {
			is30MinAfterInterviewEnded = true
		}

		const minutes: number = Math.floor((difference / 1000 / 60) % 60)
		const hours: number = Math.floor((difference / (1000 * 60 * 60)) % 24)
		const days: number = Math.floor(difference / (1000 * 60 * 60 * 24))
		let datePublicString: string = ''
		const isDaysEmpty: boolean = days === 0
		const isHoursEmpty: boolean = hours === 0
		if (isDaysEmpty && isHoursEmpty) {
			datePublicString += 'Осталось ' + minutes + ' минут'
		}
		if (isDaysEmpty && !isHoursEmpty) {
			datePublicString += 'Осталось ' + hours + ' ч' + minutes + ' м'
		}
		if (!isDaysEmpty && !isHoursEmpty) {
			datePublicString += 'Осталось ' + days + ' дн ' + hours + ' ч'
		}
		return (
			<div className='flex flex-col gap-[30px]'>
				{format.format === 'OFFLINE' &&
					!isInterviewStarted && ( // Офлайн собес, ожидание
						<div className="flex flex-col justify-center">
							<h3 className=" mb-[20px] font-content-font font-bold text-black text-[16px]/[19.2px]">
								Собеседование
							</h3>
							<h4 className=" mb-[10px] font-content-font font-normal text-black text-[12px]/[14.4x] opacity-40">
								Дата и время:
							</h4>
							<h4 className="font-content-font font-normal text-black text-[16px]/[19.2px]">
								{props.timeFormated}
							</h4>
						</div>
					)}
				{format.format === 'ONLINE' &&
					!isInterviewStarted &&
					!is5MinBeforeInterviewStarted && ( // Онлайн собес, ождиание
						<div className="flex flex-col justify-center">
							<h4 className="mb-[20px] font-content-font font-normal text-black text-[16px]/[19.2px]">
								Подключитесь к онлайн-конференции
							</h4>
							<button className="hover:none h-[40px] w-[257px] cursor-default bg-[#3073D7] opacity-[32%] border-none rounded-[54.5px] text-white text-[16px]/[16px]">
								{datePublicString}
							</button>
						</div>
					)}
				{((format.format === 'ONLINE' &&
					isInterviewStarted &&
					is5MinBeforeInterviewStarted) ||
					(format.format === 'ONLINE' &&
						isInterviewStarted &&
						!is30MinAfterInterviewEnded)) && ( // Онлайн собес, подкбчиться 5 | 30
					<div className="flex flex-col justify-center">
						<h4 className="mb-[20px] font-content-font font-normal text-black text-[16px]/[19.2px]">
							Подключитесь к онлайн-конференции
						</h4>
						<Button
							className="h-[40px] w-[257px] bg-[#3073D7] rounded-[54.5px] text-white text-[16px]/[16px]"
							onClick={() => {}}
						>
							Подключиться
						</Button>
					</div>
				)}
				{isInterviewStarted &&
					is30MinAfterInterviewEnded && ( // Собес окончился, вынести вердикт
						<div className="flex flex-col justify-center gap-[12px]">
							<Button
								disabled={isEmploymentRequestSent || isSeekerRejected}
								className="h-[40px] w-[257px] bg-[#3073D7] rounded-[54.5px] text-white text-[16px]/[16px]"
								onClick={values => {
									aproveSeeker({
										rejectionReason: 'approve',
										action: 'EMPLOY',
										respondId: respondId.respondId
									})
										.unwrap()
										.then(() => {
											setIsEmploymentRequestSent(true)
										})
								}}
							>
								Пригласить на работу
							</Button>
							<Button
								disabled={isEmploymentRequestSent || isSeekerRejected}
								className=" mr-[50px] h-[40px] font-content-font font-normal text-black border-[1px] border-black text-[16px]/[16px] rounded-[54.5px]"
								onClick={() => {
									setIsRefuseModalOpen(true)
								}}
							>
								Отказать
							</Button>
						</div>
					)}
				<Button
					disabled={isEmploymentRequestSent || isSeekerRejected}
					className="h-[40px] w-[257px] bg-[#3073D7] rounded-[54.5px] text-white text-[16px]/[16px]"
					onClick={values => {
						aproveSeeker({
							rejectionReason: 'approve',
							action: 'EMPLOY',
							respondId: respondId.respondId
						})
							.unwrap()
							.then(() => {
								setIsEmploymentRequestSent(true)
							})
					}}
				>
					invite without time check
				</Button>
			</div>
		)
	}
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
					open={isUnsuccessModalOpen}
					onCancel={() => {
						setIsUnsuccessModalOpen(false)
					}}
					title={null}
					footer={null}
					width={407}
				>
					<p className="font-content-font font-normal text-black text-[16px]/[20px] text-center">
						Произошла ошибка или нет ответа от сервера.
					</p>
					<div className="mt-[40px] flex gap-[12px]">
						<Button
							className="ml-auto mr-auto"
							type="primary"
							onClick={() => {
								setIsUnsuccessModalOpen(false)
							}}
						>
							ОК
						</Button>
					</div>
				</Modal>
			</ConfigProvider>
			<div className="pl-[52px] pr-[10%] py-[140px] w-full">
				<div>
					<Button
						onClick={() => {
							window.history.back()
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
									{data?.userData?.lastname +
										' ' +
										data?.userData?.firstname +
										' ' +
										data?.userData?.middlename}
								</p>
								<p className="font-content-font font-normal text-black text-[16px]/[19.2px]">
									{data?.userData?.sex}, {data?.userData?.age} года
								</p>
								<div className="flex gap-[36px]">
									<div className="flex flex-col gap-[8px]">
										<p className="font-content-font font-normal text-black text-[12px]/[14.4x] opacity-40">
											Дата рождения
										</p>
										<p className="font-content-font font-normal text-black text-[16px]/[19.2px]">
											{data?.userData?.bday}
										</p>
									</div>
									<div className="flex flex-col gap-[8px]">
										<p className="font-content-font font-normal text-black text-[12px]/[14.4x] opacity-40">
											Страна гражданства
										</p>
										<p className="font-content-font font-normal text-black text-[16px]/[19.2px]">
											{data?.userData?.country}
										</p>
									</div>
								</div>
								<div className="flex flex-col gap-[8px]">
									<p className="font-content-font font-normal text-black text-[12px]/[14.4x] opacity-40">
										Контакты:
									</p>
									<div className="flex gap-[24px]">
										<p className="font-content-font font-normal text-black text-[16px]/[19.2px]">
											{data?.userData?.phone}
										</p>
										<p className="font-content-font font-normal text-black text-[16px]/[19.2px]">
											{data?.userData?.email}
										</p>
									</div>
								</div>
							</div>
						</div>
						<ConfigProvider
							theme={{
								token: {
									boxShadow: '0 0 19px 0 rgba(212, 227, 241, 0.6)'
								}
							}}
						>
							<Modal
								centered
								open={isRefuseModalOpen}
								onCancel={() => {
									setIsRefuseModalOpen(false)
								}}
								title={null}
								footer={null}
								width="45%"
							>
								<Form
									layout="vertical"
									requiredMark={false}
									className="p-[20px]"
									onFinish={values => {
										rejectSeeker({
											rejectionReason: values.reason,
											action: 'REJECT',
											respondId: respondId.respondId
										})
											.unwrap()
											.then(() => {
												setIsSeekerRejected(true)
											})
										setIsRefuseModalOpen(false)
									}}
								>
									<h2 className="font-normal text-[18px]">
										Отказ на должность
									</h2>
									<h3 className="mb-[40px] font-bold text-[18px]">
										«{data?.vacancyName}»
									</h3>
									<Form.Item
										name={'reason'}
										label={
											<label className="mb-[10px] text-black text-[18px]/[18px] font-content-font font-normal">
												Причина отказа
											</label>
										}
										rules={[{ message: 'не выбрана причина отказа' }]}
									>
										<Select
											placeholder="Не хватает опыта"
											options={[
												{
													value: 'Не хватает опыта',
													label: 'Не хватает опыта'
												},
												{
													value: 'Нашли другого специалиста',
													label: 'Нашли другого специалиста'
												}
											]}
										></Select>
									</Form.Item>
									<Button
										className="bg-[#3073D7] text-base rounded-[54.5px] text-white py-[12px] px-[24px]"
										htmlType="submit"
									>
										Отправить
									</Button>
								</Form>
							</Modal>
						</ConfigProvider>
						<Component
							time={time.time}
							format={format.format}
							timeFormated={timeFormated.timeFormated}
						></Component>
					</div>
					<hr />
					<div className="flex flex-col gap-[24px]">
						<p className="font-content-font font-normal text-black text-[18px]/[21.6x] opacity-40">
							Сопроводительное письмо
						</p>
						<p className="font-content-font font-normal text-black text-[16px]/[19.2px]">
							{data?.respondData.coverLetter}
						</p>
					</div>
					<hr />
					<div className="flex flex-col gap-[24px]">
						<p className="font-content-font font-normal text-black text-[18px]/[21.6x] opacity-40">
							Опыт работы
						</p>
						<div className="grid grid-cols-[194px_auto] gap-x-[20px] gap-y-[24px] w-[90%]">
							{data?.respondData.portfolio.workExperiences.map(exp => (
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
					</div>
					<hr />
					<div className="flex flex-col gap-[24px]">
						<p className="font-content-font font-normal text-black text-[18px]/[21.6x] opacity-40">
							Образование
						</p>
						<div className="grid grid-cols-[194px_auto] gap-x-[20px] gap-y-[24px] w-[90%]">
							{data?.educations.map(edu => (
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
						</div>
					</div>
					<hr />
					<div className="flex flex-col">
						<p className="font-content-font font-normal text-black text-[18px]/[21.6x] opacity-40 w-[194px]">
							Профессиональные навыки
						</p>
						<div className="grid grid-cols-[194px_auto] gap-x-[20px] w-[90%]">
							<div className="col-start-2">
								{/*
                {data?.respondData.skills.aboutMe}
                TODO: разобраться почему приходит undefined
                */}
							</div>
							<div className="col-start-2 flex gap-[8px] flex-wrap"></div>
						</div>
					</div>
				</div>
			</div>
		</>
	)
}
