import { useEffect } from 'react'
import { useDispatch } from 'react-redux'

import { useAppSelector } from '../../../../store'
import {
	setStageProgressAsFilling,
	setStageProgressAsReady
} from '../../../../store/reducers/EmploymentProgressSlice'

import { FileAttachment } from './FileAttachment'

export const EmplDocAttachment = (props: {
	respondId: number
	stageId: number
	stageName: string
}) => {
	const { docs } = useAppSelector(state => state.employmentSeekerDocs)
	const { empData } = useAppSelector(state => state.employmentData)
	const foundStage = empData.stages.find(stage => stage.id === props.stageId)
	const dispatch = useDispatch()

	useEffect(() => {
		if (foundStage) {
			if (
				foundStage.documents.length ===
				docs.filter(doc => doc.employmentStageType === props.stageName).length
			) {
				console.log('Все файлы на данном этапе загружены')
				dispatch(setStageProgressAsReady(props.stageId))
			} else {
				console.log('Какого-то из файлов не хватает')
				dispatch(setStageProgressAsFilling(props.stageId))
			}
		}
	}, [empData])

	return (
		<>
			<div className="flex flex-col gap-[40px] font-content-font font-normal text-black text-[16px]/[19.2px]">
				<div className="flex flex-col gap-[12px]">
					<p>Необходимые документы:</p>
					<ol className="ml-[2%]">
						{docs.map(doc => (
							<li>{doc.name}</li>
						))}
					</ol>
				</div>
				<div className="bg-white rounded-[16px] shadow-custom-shadow p-[20px] w-[50%] flex flex-col gap-[20px]">
					<p className="opacity-80">Прикрепить файлы</p>
					<div className="grid gap-x-[36px] gap-y-[12px] grid-cols-[50%_auto_100px_21px] items-center">
						{docs.map(doc => (
							<FileAttachment
								{...doc}
								respondId={props.respondId}
								stageId={props.stageId}
							/>
						))}
					</div>
				</div>
			</div>
		</>
	)
}
