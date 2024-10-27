import { Button, ConfigProvider, Modal, Spin } from 'antd'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { useAppSelector} from '../../../../store'
import { setCurrentResponce } from '../../../../store/reducers/CurrentResponceSlice'
import { DepEmploymentStageItem } from './depEmploymentStageItem'
import { LoadingOutlined } from '@ant-design/icons'
import {
	useGetEmploymentStageStatusQuery,
	useMarkBankCardApplicationFormedMutation,
	useGetPersonnelStagesQuery, useGetEmploymentReqStageStatusQuery
} from '../../../../store/api/serviceApi'
import { useState } from 'react'
import { DocumentElem } from './components/DocumentElem'

export const EmploymentStageInfo = ( ) => {

	const dispatch = useDispatch()
	const navigate = useNavigate()

	const employmentSeekerName  = useAppSelector(state => state.employmentSeeker.currentEmploymentSeekerName)
	const employmentSeekerVacancy  = useAppSelector(state => state.employmentSeeker.currentEmploymentSeekerVacancy)
	const respondId = useAppSelector(state => state.currentResponce)

	const { data: stages, isLoading: loadingReq } = useGetEmploymentStageStatusQuery({ respondId: respondId.respondId})
	const { data: sixStage, isLoading: loadingBank } = useGetEmploymentReqStageStatusQuery({ respondId: respondId.respondId })
	const stagesArrayy = sixStage?.stages || [] // массив массивов c этапами
	const sortedStagess = stagesArrayy.flat().sort((a, b) => a.id - b.id)
	const stagesArray = stages?.stages || [] // массив массивов c этапами
	const sortedStages = stagesArray.flat().sort((a, b) => a.id - b.id) // сортирую потому что приходит вперемешку
	sortedStages.push(sortedStagess[0])
	console.log(sortedStages)

	if (loadingReq || loadingBank) {
		return (
			<>
				<div className="w-screen h-screen flex items-center">
					<div className="text-center ml-auto mr-[50%]">
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
	}
	return (
		<>
			<div className="w-full flex flex-col px-[53px] mt-[140px]">
				<h1 className="font-normal text-[28px]/[28px]">{employmentSeekerName}</h1>
				<Button
					type="default"
					className="max-w-[102px] bg-[#F5F8FB] mt-[20px] py-[8px] px-[24px] text-[#333333] border-[#333333] border-[1px] rounded-[54.5px] text-[16px]"
					onClick={() => {
						dispatch(setCurrentResponce(respondId.respondId))
						navigate('/services/personnelaccounting/employment/stages/seeker-info')
					}}
				>Резюме</Button>
				<h3 className="mt-[53px] text-[18px] font-normal">
					Вакансия: <span className="font-bold">«{employmentSeekerVacancy}»</span>
				</h3>
				<div className="mt-[40px] mb-[100px] gap-[12px] flex flex-col ">
					{sortedStages?.[1] && (
						<DepEmploymentStageItem
							stage={2}
							role={'personnel'}
							comment={sortedStages[1].comment}
							stageStatus={sortedStages[1].status}
							documentArray={sortedStages[1].documents} />
					)}

					{sortedStages?.[2] && (
						<DepEmploymentStageItem
							stage={3}
							role={'personnel'}
							comment={sortedStages[2].comment}
							stageStatus={sortedStages[2].status}
							documentArray={sortedStages[2].documents} />
					)}

					{sortedStages?.[3] && (
						<DepEmploymentStageItem
							stage={4}
							role={'personnel'}
							comment={sortedStages[3].comment}
							stageStatus={sortedStages[3].status}
							documentArray={sortedStages[3].documents}
						/>
					)}

					{sortedStages?.[4] && (
						<DepEmploymentStageItem
							stage={5}
							role={'personnel'}
							comment={sortedStages[4].comment}
							stageStatus={sortedStages[4].status}
							documentArray={sortedStages[4].documents}
						/>
					)}
					{sortedStages?.[5] && (
						<DepEmploymentStageItem
							stage={6}
							role={'personnel'}
							comment={''}
							stageStatus={sortedStages[5].status}
							documentArray={sortedStages[5].documents}
						/>
					)}
				</div>
			</div>
		</>
	)
}