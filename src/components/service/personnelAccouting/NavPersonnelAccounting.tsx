import { Collapse, CollapseProps, ConfigProvider } from 'antd'
import clsx from 'clsx'
import { useLocation, useNavigate } from 'react-router-dom'

import { BriefcaseSvg } from '../../../assets/svg/BriefcaseSvg'
import { useAppSelector } from '../../../store'
import { Header } from '../../layout/Header'
import { ChatEmpDemp } from '../Chat/ChatEmpDemp'
import { DepEmployment } from '../employmentStage/personnelDepartment/depEmployment'

import { Archive } from './Archive'
import { ArchiveRespondInfo } from './ArchiveRespondInfo'
import Catalog from './CatalogForEdit'
import { ChatIcon } from './ChatIcon'
import { Reserve } from './Reserve'
import { ReserveRespondInfo } from './ReserveRespondInfo'
import { RespondInfo } from './RespondInfo'
import { Responds } from './Responds'
import { RespondsIcon } from './RespondsIcon'
import { VacanciesIcon } from './VacanciesIcon'
import { VacancyEditView } from './VacancyEditView'
import { VacancyRequestCreateView } from './VacancyRequestCreateView'
import { VacancyRequestDeleteView } from './VacancyRequestDeleteView'
import { VacancyRequestUpdateView } from './VacancyRequestUpdateView'
import { VacancyRequestsPage } from './VacancyRequestsPage'
import { VacancyResponces } from './VacancyResponces'
import { SupervisorInterviewCreate } from './supervisor/Interview/SupervisorInterviewCreate'
import { SupervisorInterviewSeekerInfo } from './supervisor/Interview/SupervisorInterviewSeekerInfo'
import { SupervisorInterviews } from './supervisor/Interview/SupervisorInterviews'
import { RespondsSupervisor } from './supervisor/RespondsSupervisor'
import { SupervisorCreateVacancyForm } from './supervisor/vacancy/SupervisorCreateVacancyForm'
import { SupervisorUpdateVacancy } from './supervisor/vacancy/SupervisorUpdateVacancy'
import { SupervisorVacancies } from './supervisor/vacancy/SupervisorVacancies'
import { EmploymentStageInfo } from '../employmentStage/personnelDepartment/employmentStageInfo'
import { DepEmploymentSeekerInfo } from '../employmentStage/personnelDepartment/depEmploymentSeekerInfo'
import { RequisiteMain } from '../requisite/review/RequisiteMain'
import { RequisiteStage } from '../requisite/review/RequisiteStage'
import { RequisiteSeeker } from '../requisite/review/RequisiteSeeker'

export const NavPesonnelAccounting = () => {
	const { pathname } = useLocation()
	const navigate = useNavigate()
	const roles = useAppSelector(state => state.auth.user?.roles)
	const respondId = useAppSelector(state => state.currentResponce)

	const handleNavigate = (url: string) => {
		navigate(url)
	}

	const isEmployee = roles?.find(role => role.type === 'EMPL')
	const isSupervisor = roles?.find(role => role.type === 'OTHER')

	const navEmployeeList = [
		{
			id: '/services/personnelaccounting/responds',
			icon: <RespondsIcon />,
			name: 'Отклики'
		},
		{
			id: '/services/personnelaccounting/chat',
			icon: <ChatIcon />,
			name: 'Сообщения'
		},
		{
			id: '/services/personnelaccounting/employment',
			icon: <BriefcaseSvg />,
			name: 'Этап трудоустройства'
		},
		{
			id: '/services/personnelaccounting/vacancies',
			icon: <VacanciesIcon />,
			name: 'Вакансии'
		},
		{
			id: '/services/personnelaccounting/reserve',
			icon: <RespondsIcon />,
			name: 'Кадровый резерв'
		},
		{
			id: '/services/personnelaccounting/requisite',
			icon: <VacanciesIcon/>,
			name: 'Реквизиты'
		}
	]

	const navSupervisorList = [
		{
			id: '/services/personnelaccounting/supervisor/responds',
			icon: <RespondsIcon />,
			name: 'Отклики'
		},
		{
			id: '/services/personnelaccounting/supervisor/invitation',
			icon: <BriefcaseSvg />,
			name: 'Собеседование'
		},
		{
			id: '/services/personnelaccounting/supervisor/vacancies',
			icon: <VacanciesIcon />,
			name: 'Вакансии'
		}
	]

	const navEmployeeListVacancyItems: CollapseProps['items'] = [
		{
			key: 'allVacancies',
			label: (
				<div className="flex items-center gap-[10px]">
					{<VacanciesIcon />}
					<p className="text-base">{'Вакансии'}</p>
				</div>
			),
			children: (
				<div className="flex flex-col gap-[12px] ml-[24px]">
					<p
						className={clsx(
							'font-content-font text-black text-[14px]/[14px] font-normal',
							pathname !== '/services/personnelaccounting/vacancies' &&
								'opacity-[52%]'
						)}
						onClick={() => {
							navigate('/services/personnelaccounting/vacancies')
						}}
					>
						Все вакансии
					</p>
					<p
						className={clsx(
							'font-content-font text-black text-[14px]/[14px] font-normal',
							pathname !== '/services/personnelaccounting/vacancyrequests' &&
								'opacity-[52%]'
						)}
						onClick={() => {
							navigate('/services/personnelaccounting/vacancyrequests')
						}}
					>
						Заявки от руководилей
					</p>
				</div>
			)
		}
	]

	const navEmployeeListRequisiteItems: CollapseProps['items'] = [
		{
			key: 'requisite',
			label: (
				<div className="flex items-center gap-[10px]">
					{<VacanciesIcon />}
					<p className="text-base">{'Реквизиты'}</p>
				</div>
			),
		}
	]

	const navEmployeeListReserveItems: CollapseProps['items'] = [
		{
			key: 'allVacancies',
			label: (
				<div className="flex items-center gap-[10px]">
					{<VacanciesIcon />}
					<p className="text-base">{'Кадровый резерв'}</p>
				</div>
			),
			children: (
				<div className="flex flex-col gap-[12px] ml-[24px]">
					<p
						className={clsx(
							'font-content-font text-black text-[14px]/[14px] font-normal',
							pathname !== '/services/personnelaccounting/reserve' &&
								'opacity-[52%]'
						)}
						onClick={() => {
							navigate('/services/personnelaccounting/reserve')
						}}
					>
						Резерв
					</p>
					<p
						className={clsx(
							'font-content-font text-black text-[14px]/[14px] font-normal',
							pathname !== '/services/personnelaccounting/archive' &&
								'opacity-[52%]'
						)}
						onClick={() => {
							navigate('/services/personnelaccounting/archive')
						}}
					>
						Архив
					</p>
				</div>
			)
		}
	]

	const navSupervisorListVacancyItems: CollapseProps['items'] = [
		{
			key: 'allVacancies',
			label: (
				<div className="flex items-center gap-[10px]">
					{<VacanciesIcon />}
					<p className="text-base">{'Вакансии'}</p>
				</div>
			),
			children: (
				<div className="flex flex-col gap-[12px] ml-[24px]">
					<p
						className={clsx(
							'font-content-font text-black text-[14px]/[14px] font-normal',
							pathname !==
								'/services/personnelaccounting/supervisor/vacancies' &&
								'opacity-[52%]'
						)}
						onClick={() => {
							navigate('/services/personnelaccounting/supervisor/vacancies')
						}}
					>
						Все вакансии
					</p>
					<p
						className={clsx(
							'font-content-font text-black text-[14px]/[14px] font-normal',
							pathname !==
								'/services/personnelaccounting/supervisor/createvacancy' &&
								'opacity-[52%]'
						)}
						onClick={() => {
							navigate('/services/personnelaccounting/supervisor/createvacancy')
						}}
					>
						Создать вакансию
					</p>
				</div>
			)
		}
	]

	const navSupervisorListInterviewItems: CollapseProps['items'] = [
		{
			key: 'allInterviews',
			label: (
				<div className="flex items-center gap-[10px]">
					{<BriefcaseSvg />}
					<p className="text-base">{'Собеседование'}</p>
				</div>
			),
			children: (
				<div className="flex flex-col gap-[12px] ml-[24px]">
					<p
						className={clsx(
							'font-content-font text-black text-[14px]/[14px] font-normal',
							pathname !==
								'/services/personnelaccounting/supervisor/invitation' &&
								'opacity-[52%]'
						)}
						onClick={() => {
							navigate('/services/personnelaccounting/supervisor/invitation')
						}}
					>
						Все собеседования
					</p>
					<p
						className={clsx(
							'font-content-font text-black text-[14px]/[14px] font-normal',
							pathname !==
								'/services/personnelaccounting/supervisor/scheduleinvitation' &&
								'opacity-[52%]'
						)}
						onClick={() => {
							navigate(
								'/services/personnelaccounting/supervisor/scheduleinvitation'
							)
						}}
					>
						Назначить собеседование
					</p>
				</div>
			)
		}
	]

	const handleList = navEmployeeList.map(({ id, icon, name }, index) => {
		if (name === 'Вакансии') {
			return (
				<li
					key={index}
					className={clsx(
						'w-full flex items-center pl-[16px] hover:bg-[#F5F8FB]  cursor-pointer',
						id === pathname && 'bg-[#F5F8FB]'
					)}
				>
					<ConfigProvider
					// theme={{
					// 	components: {
					// 		Collapse: {
					// 			headerBg: '#ffffff',
					// 			headerPadding: '0px 20px 0px 0px'
					// 		}
					// 	}
					// }}
					>
						<Collapse
							className="w-full !bg-inherit"
							items={navEmployeeListVacancyItems}
							expandIconPosition="end"
							bordered={false}
							style={{}}
						/>
					</ConfigProvider>
				</li>
			)
		} else if (name === 'Кадровый резерв') {
			return (
				<li
					key={index}
					className={clsx(
						'w-full flex items-center pl-[16px] hover:bg-[#F5F8FB]  cursor-pointer',
						id === pathname && 'bg-[#F5F8FB]'
					)}
				>
					<Collapse
						className="w-full !bg-inherit"
						items={navEmployeeListReserveItems}
						expandIconPosition="end"
						bordered={false}
						style={{}}
					/>
				</li>
			)
		} else {
			return (
				<li
					key={index}
					className={clsx(
						'w-full flex items-center py-2 pl-8 hover:bg-[#F5F8FB]  cursor-pointer',
						id === pathname && 'bg-[#F5F8FB]'
					)}
					onClick={() => handleNavigate(id)}
				>
					<div className="flex items-center gap-[10px]">
						{icon}
						<p className="text-base">{name}</p>
					</div>
				</li>
			)
		}
	})

	const handleSupervisorList = navSupervisorList.map(
		({ id, icon, name }, index) => {
			if (name === 'Вакансии') {
				return (
					<li
						key={index}
						className={clsx(
							'w-full flex items-center pl-[16px] hover:bg-[#F5F8FB]  cursor-pointer',
							id === pathname && 'bg-[#F5F8FB]'
						)}
					>
						<ConfigProvider
						// theme={{
						// 	components: {
						// 		Collapse: {
						// 			headerBg: '#ffffff',
						// 			headerPadding: '0px 20px 0px 0px'
						// 		}
						// 	}
						// }}
						>
							<Collapse
								className="w-full !bg-inherit"
								items={navSupervisorListVacancyItems}
								expandIconPosition="end"
								bordered={false}
								style={{}}
							/>
						</ConfigProvider>
					</li>
				)
			} else if (name === 'Собеседование') {
				return (
					<li
						key={index}
						className={clsx(
							'w-full flex items-center pl-5 hover:bg-[#F5F8FB]  cursor-pointer',
							id === pathname && 'bg-[#F5F8FB]'
						)}
					>
						<ConfigProvider
						// theme={{
						// 	components: {
						// 		Collapse: {
						// 			headerBg: '#ffffff',
						// 			headerPadding: '0px 20px 0px 0px'
						// 		}
						// 	}
						// }}
						>
							<Collapse
								className="w-full !bg-inherit"
								items={navSupervisorListInterviewItems}
								expandIconPosition="end"
								bordered={false}
								style={{}}
							/>
						</ConfigProvider>
					</li>
				)
			} else {
				return (
					<li
						key={index}
						className={clsx(
							'w-full flex items-center py-2 pl-8 hover:bg-[#F5F8FB]  cursor-pointer',
							id === pathname && 'bg-[#F5F8FB]'
						)}
						onClick={() => handleNavigate(id)}
					>
						<div className="flex items-center gap-[10px]">
							{icon}
							<p className="text-base">{name}</p>
						</div>
					</li>
				)
			}
		}
	)

	if (!(isEmployee || isSupervisor)) return <></>

	return (
		<>
			<Header type="service" service="employment" />
			{isEmployee ? (
				<div className="shadowNav">
					<ul className="min-w-[230px] pt-14 flex flex-col gap-4 sticky top-[80px]">
						{handleList}
					</ul>
				</div>
			) : (
				<div className="shadowNav">
					<ul className="min-w-[230px] pt-14 flex flex-col gap-4 sticky top-[80px]">
						{handleSupervisorList}
					</ul>
				</div>
			)}
			<div className="bg-[#F5F8FB] flex w-full">
				{pathname === navEmployeeList[0].id && <Responds />}
				{pathname.match(
					'services/personnelaccounting/responds/byvacancy/*'
				) && <VacancyResponces />}
				{pathname.match('services/personnelaccounting/responds/fullinfo') && (
					<RespondInfo type="PERSONNEL_DEPARTMENT" />
				)}
				{pathname.match(
					'services/personnelaccounting/supervisor/responds/fullinfo'
				) && <RespondInfo type="SUPERVISOR" />}
				{pathname.includes(navEmployeeList[1].id) && <ChatEmpDemp />}
				{pathname === navEmployeeList[2].id && <DepEmployment />}
				{pathname === navEmployeeList[3].id && <Catalog />}
				{pathname.match(
					'services/personnelaccounting/vacancies/vacancyedit'
				) && <VacancyEditView />}
				{pathname === '/services/personnelaccounting/vacancyrequests' && (
					<VacancyRequestsPage />
				)}
				{pathname === '/services/personnelaccounting/request/create' && (
					<VacancyRequestCreateView />
				)}
				{pathname === '/services/personnelaccounting/request/update' && (
					<VacancyRequestUpdateView />
				)}
				{pathname === '/services/personnelaccounting/request/delete' && (
					<VacancyRequestDeleteView />
				)}
				{pathname === navEmployeeList[4].id && <Reserve />}
				{pathname.match('/services/personnelaccounting/reserve/fullinfo') && (
					<ReserveRespondInfo type="PERSONNEL_DEPARTMENT" />
				)}
				{pathname === '/services/personnelaccounting/archive' && <Archive />}
				{pathname.match('services/personnelaccounting/archive/fullinfo') && (
					<ArchiveRespondInfo type="PERSONNEL_DEPARTMENT" />
				)}
				{pathname === navSupervisorList[0].id && <RespondsSupervisor />}
				{pathname === navSupervisorList[1].id && <></>}
				{pathname === navSupervisorList[2].id && <SupervisorVacancies />}
				{pathname ===
					'/services/personnelaccounting/supervisor/createvacancy' && (
					<SupervisorCreateVacancyForm />
				)}
				{pathname ===
					'/services/personnelaccounting/supervisor/vacancyview' && (
					<SupervisorUpdateVacancy />
				)}
				{pathname === '/services/personnelaccounting/supervisor/invitation' && (
					<SupervisorInterviews />
				)}
				{pathname ===
					'/services/personnelaccounting/supervisor/scheduleinvitation' && (
					<SupervisorInterviewCreate />
				)}
				{pathname ===
					'/services/personnelaccounting/supervisor/invitation/seekerinfo' && (
					<SupervisorInterviewSeekerInfo/>
				)}
				{pathname ===
					`/services/personnelaccounting/employment/stages` && (
						<EmploymentStageInfo/>
					)}
				{pathname ===
					'/services/personnelaccounting/employment/stages/seeker-info' && (
						<DepEmploymentSeekerInfo/>
					)}
				{pathname ===
					'/services/personnelaccounting/requisite' && (
						<RequisiteMain/>
					)}
				{pathname ===
					`/services/personnelaccounting/requisite/requisite-review` && (
						<RequisiteStage/>
					)}
				{pathname ===
					'/services/personnelaccounting/requisite/requisite-review/seeker-info' && (
						<RequisiteSeeker/>
					)}
			</div>
		</>
	)
}
