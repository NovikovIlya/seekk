import { Button, Spin } from 'antd'
import { setCurrentResponce } from '../../../../store/reducers/CurrentResponceSlice'
import { useAppSelector } from '../../../../store'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { LoadingOutlined } from '@ant-design/icons'
import { useGetEmploymentReqStageStatusQuery, useGetEmploymentStageStatusQuery } from '../../../../store/api/serviceApi'
import { DepEmploymentStageItem } from '../../employmentStage/personnelDepartment/depEmploymentStageItem'

export const RequisiteStage = () => {

	const respondId = useAppSelector(state => state.currentResponce)
	const seekerName  = useAppSelector(state => state.requisiteSeeker.currentRequisiteSeekerName)
	const seekerVacancy  = useAppSelector(state => state.requisiteSeeker.currentRequisiteSeekerVacancy)

	const dispatch = useDispatch()
	const navigate = useNavigate()


	const { data: req_data, isLoading : loading } = useGetEmploymentReqStageStatusQuery({ respondId: respondId.respondId })
	console.log(req_data)
	const stagesArray = req_data?.stages || [] // массив массивов c этапами

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
				<h1 className="font-normal text-[28px]/[28px]">{seekerName}</h1>
				<Button
					type="default"
					className="max-w-[102px] mt-[20px] bg-[#F5F8FB] py-[8px] px-[24px] text-[#333333] border-[#333333] border-[1px] rounded-[54.5px] text-[16px]"
					onClick={() => {
						dispatch(setCurrentResponce(respondId.respondId))
						navigate('/services/personnelaccounting/requisite/requisite-review/info/seekerinfo/')
					}}
				>Резюме</Button>
				<h3 className="mt-[53px] text-[18px] font-normal">
					Вакансия: <span className="font-bold">{seekerVacancy}</span>
				</h3>
				<div className="mt-[40px] mb-[100px] gap-[12px] flex flex-col ">
					{stagesArray?.[0] && (
						<DepEmploymentStageItem
							stage={6}
							role={'accounting'}
							comment={stagesArray[0].comment}
							stageStatus={stagesArray[0].status}
							documentArray={stagesArray[0].documents} />
					)}
				</div>
			</div>
		</>
	)
}