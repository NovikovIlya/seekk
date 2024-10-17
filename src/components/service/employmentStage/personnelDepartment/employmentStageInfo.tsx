import { Button, Spin } from 'antd'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { useAppSelector} from '../../../../store'
import { setCurrentResponce } from '../../../../store/reducers/CurrentResponceSlice'
import { DepEmploymentStageItem } from './depEmploymentStageItem'
import { LoadingOutlined } from '@ant-design/icons'
import { useGetEmploymentStageStatusQuery, useGetEmploymentReqStageStatusQuery } from '../../../../store/api/serviceApi'

export const EmploymentStageInfo = ( ) => {

	const dispatch = useDispatch()
	const navigate = useNavigate()

	const currentUrl = window.location.href
	const parts = currentUrl.split('/')
	const userIdStr = parts[parts.length - 1]
	const id = parseInt(userIdStr, 10)

	const employmentSeekerName  = useAppSelector(state => state.employmentSeeker.currentEmploymentSeekerName)
	const employmentSeekerVacancy  = useAppSelector(state => state.employmentSeeker.currentEmploymentSeekerVacancy)

	const { data: requisite_items, isLoading: loading } = useGetEmploymentStageStatusQuery({ respondId: id })

	const stagesArray = requisite_items?.stages || [] // массив массивов c этапами
	const sortedStages = stagesArray.flat().sort((a, b) => a.id - b.id) // сортирую потому что приходит вперемешку

	if (loading) {
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
						dispatch(setCurrentResponce(id))
						navigate('/services/personnelaccounting/employment/stages/seekerinfo')
					}}
				>Резюме</Button>
				<h3 className="mt-[53px] text-[18px] font-normal">
					Вакансия: <span className="font-bold">«{employmentSeekerVacancy}»</span>
				</h3>
				<div className="mt-[40px] mb-[100px] gap-[12px] flex flex-col ">
					{sortedStages?.[1] && (
						<DepEmploymentStageItem
							stage={2}
							comment={sortedStages[1].comment}
							stageStatus={sortedStages[1].status}
						 	documentArray={sortedStages[1].documents}/>
					)}

					{sortedStages?.[2] && (
						<DepEmploymentStageItem
							stage={3}
							comment={sortedStages[2].comment}
							stageStatus={sortedStages[2].status}
							documentArray={sortedStages[2].documents}/>
					)}

					{sortedStages?.[3] && (
						<DepEmploymentStageItem
							stage={4}
							comment={sortedStages[3].comment}
							stageStatus={sortedStages[3].status}
							documentArray={sortedStages[3].documents}
						/>
					)}

					{sortedStages?.[4] && (
						<DepEmploymentStageItem
							stage={5}
							comment={sortedStages[4].comment}
							stageStatus={sortedStages[4].status}
							documentArray={sortedStages[4].documents}
						/>
					)}
				</div>
			</div>
		</>
	)
}