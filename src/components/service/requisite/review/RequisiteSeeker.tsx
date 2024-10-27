import { Button } from 'antd'
import { NocircleArrowIcon } from '../../jobSeeker/NoCircleArrowIcon'
import { AvatartandardSvg } from '../../../../assets/svg/AvatarStandardSvg'
import { useAppSelector } from '../../../../store'
import { useGetRespondFullInfoQuery } from '../../../../store/api/serviceApi'


export const RequisiteSeeker = () => {

	const respondId = useAppSelector(state => state.currentResponce)
	const { data } = useGetRespondFullInfoQuery(respondId.respondId)

	return (
		<>
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
							<div className="col-start-2 flex gap-[8px] flex-wrap">
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	)
}
