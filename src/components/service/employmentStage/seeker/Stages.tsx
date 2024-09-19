import { LoadingOutlined } from '@ant-design/icons'
import { Spin } from 'antd'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useLocation } from 'react-router-dom'

import { useAppSelector } from '../../../../store'
import {
	useLazyGetEmploymentDataQuery,
	useLazyGetEmploymentDocsQuery
} from '../../../../store/api/serviceApi'
import { setAllData } from '../../../../store/reducers/EmploymentDataSlice'
import { setAllProgress } from '../../../../store/reducers/EmploymentProgressSlice'
import { setDocs } from '../../../../store/reducers/EmploymentSeekerDocsSlice'

import { EmplDocAttachment } from './EmplDocAttachment'
import { EmplInstruction } from './EmplInstruction'
import { EmplMedExam } from './EmplMedExam'
import { EmplMedInvite } from './EmplMedInvite'
import { EmplRequisites } from './EmplRequisites'
import { EmplSend } from './EmplSend'
import { EmplWorkConditions } from './EmplWorkConditions'
import { NavPanel } from './NavPanel'

export const Stages = () => {
	const { pathname } = useLocation()
	const dispatch = useDispatch()

	const respondId = parseInt(pathname.substring(pathname.lastIndexOf('/') + 1))

	const vacancyId = parseInt(
		pathname.substring(
			pathname.substring(0, pathname.lastIndexOf('/')).lastIndexOf('/') + 1
		)
	)

	const { currentStage } = useAppSelector(state => state.currentEmploymentStage)

	const [getEmpData, empData] = useLazyGetEmploymentDataQuery()
	const [getEmpDocs, empDocs] = useLazyGetEmploymentDocsQuery()

	useEffect(() => {
		getEmpData(respondId)
			.unwrap()
			.then(data => {
				dispatch(setAllData(data))
				dispatch(
					setAllProgress(
						data.stages.map(stage => {
							if (stage.status === 'FILLING') {
								const smthMissing = stage.documents.find(
									doc => doc.status === 'NOT_ATTACHED'
								)
								if (smthMissing) {
									return stage
								} else {
									return { ...stage, status: 'READY' }
								}
							} else {
								return stage
							}
						})
					)
				)
			})
	}, [])

	useEffect(() => {
		getEmpDocs(vacancyId)
			.unwrap()
			.then(data => {
				dispatch(setDocs(data))
			})
	}, [])

	if (currentStage === 0 && (empData.isFetching || empData.isLoading)) {
		return (
			<>
				<div className="w-screen h-screen flex items-center">
					<div className="text-center ml-auto mr-auto mb-[10%]">
						<Spin
							indicator={<LoadingOutlined style={{ fontSize: 36 }} spin />}
						></Spin>
						<p className="font-content-font font-normal text-black text-[18px]/[18px]">
							Идёт загрузка этапа трудоустройства...
						</p>
					</div>
				</div>
			</>
		)
	}

	return (
		<>
			<div id="wrapper" className="px-[52px] w-full">
				<div className="font-content-font font-normal text-[28px]/[28px] text-black mt-[120px]">
					Вакансия «Специалист отдела сотрудничества»
				</div>
				<NavPanel />
				<div className="w-full mt-[40px]">
					{currentStage === 1 && (
						<EmplMedInvite respondId={respondId} stageId={1} />
					)}
					{currentStage === 2 && (
						<EmplDocAttachment
							respondId={respondId}
							stageId={2}
							stageName="SECOND"
						/>
					)}
					{currentStage === 3 && <EmplWorkConditions />}
					{currentStage === 4 && <EmplMedExam />}
					{currentStage === 5 && <EmplInstruction />}
					{currentStage === 6 && <EmplRequisites />}
					{currentStage === 7 && <EmplSend />}
				</div>
			</div>
		</>
	)
}
