import { Popconfirm } from 'antd'
import dayjs from 'dayjs'
import printJS from 'print-js'
import React, { useEffect, useState } from 'react'
import { utils, writeFileXLSX } from 'xlsx'

import { DeleteRedSvg } from '../../../../assets/svg/DeleteRedSvg'
import { Load } from '../../../../assets/svg/Load'
import { PrintSvg } from '../../../../assets/svg/PrintSvg'
import { ColorBg, WrapperButton } from '../popover/WrapperButton'
import { useDeleteMutation } from '../../../../store/api/practiceApi/formingSchedule'

interface Props {
	recordFullAll?: any
	recordFull?: any
	setRecordFull?: (arg: any) => void
	setSelectedFieldFull?: (arg: any) => void
}

export const PopoverContent = ({recordFull,recordFullAll,setRecordFull,setSelectedFieldFull}: Props) => {
	// const [deletePractise] = useDeletePractiseSeveralMutation()
	const [deletePractise,{}] = useDeleteMutation()
	console.log('recordFull', recordFull)
	function translateColumnsIntoRussia({ isPrint }: { isPrint: boolean }) {
		if (isPrint) {
			const newData: any = []
			if (recordFull) {
				// const recordFullWithoutUndefinedElem = recordFull.filter((elem:any) => elem !== undefined)
				// for (let elem of recordFullWithoutUndefinedElem) {

				// const stringIndTask = isPrint
				//     ?
				//     elem.individualTasks.map((elem:any, index:any) => `${index + 1}.${elem} `).join('</br>')
				//     :
				//     elem.individualTasks.map((elem:any, index:any) => `${index + 1}.${elem} `).join('\n')

				// const stringCompetencies = isPrint
				//     ?
				//     elem.competencies.map((elem:any, index:any) => `${index + 1}.${elem} `).join('</br>')
				//     :
				//     elem.competencies.map((elem:any, index:any) => `${index + 1}.${elem} `).join('\n')

				// const startPractice = `${dayjs(elem.practicePeriod[0]).format('DD.MM.YYYY')}`
				// const endPractice = `${dayjs(elem.practicePeriod[1]).format('DD.MM.YYYY')}`
				// const stringPeriodPractice = `${startPractice} - ${endPractice}`

				const newObj = {
					'Наименование графика': recordFull.name,
					'Дата заполнения': recordFull.dateFilling,
					'Учебный год': recordFull.academicYear,
					'Период практики': recordFull.period
				}
				newData.push(newObj)
				// }
			}
			return newData
		}
		const newObj = {
			'Наименование графика': recordFull.name,
			'Дата заполнения': recordFull.dateFilling,
			'Учебный год': recordFull.academicYear,
			'Период практики': recordFull.period
		}

		// }

		return newObj
	}

	function downLoad() {
		const ws = utils.json_to_sheet([
			translateColumnsIntoRussia({ isPrint: false })
		])
		const wb = utils.book_new()
		utils.book_append_sheet(wb, ws, 'Data')
		writeFileXLSX(wb, 'File.xlsx')
	}

	function printTable() {
		function properties() {
			if (recordFull) {
				return [
					'Наименование графика',
					'Дата заполнения',
					'Учебный год',
					'Период практики'
				]
			}
		}

		printJS({
			printable: translateColumnsIntoRussia({ isPrint: true }),
			properties: properties(),
			type: 'json',
			style: 'body {font-size: 10px}'
		})
	}

	function deleteData() {
		if (setRecordFull && recordFull && recordFullAll) {

			// const recordFullWithoutUndefinedElem = recordFull.filter(
			// 	(elem: any) => elem !== undefined
			// )

			// const listId = recordFullWithoutUndefinedElem.map((elem: any) => elem.id)
			// setRecordFull(
			// 	recordFullAll.filter((elem: any) => {
			// 		return !listId.includes(elem.id)
			// 	})
			// )
			// if (setSelectedFieldFull) {
			//     setSelectedFieldFull([])
			// }

			// const objIdList: ListIdDeleteContracts = {
			//     listIdDelete: listId
			// }
			//deleteSeveralContracts(objIdList)
			// deletePractise()
		}


		// const listId = recordFull?.map((elem: any) => elem.id)
		// const listIdDelete = {
		// 	listIdDelete: listId
		// }
		// deletePractise(listIdDelete)

		deletePractise(recordFull.id)
	}


	return (
		<div className={'flex flex-col gap-2 '} onClick={(e) => { e.stopPropagation()}} >
			<WrapperButton color={ColorBg.BLUEF2} onClick={downLoad}>
				<Load />
				<span>Скачать выбранное</span>
			</WrapperButton>

			<WrapperButton color={ColorBg.BLUEF2} onClick={printTable}>
				<PrintSvg />
				<span>Печать выбранного</span>
			</WrapperButton>

			<Popconfirm
				title="Удаление"
				description="Вы уверены, что хотите удалить?"
				onConfirm={deleteData}
				okText="Да"
				cancelText="Нет"
			>
				<WrapperButton color={ColorBg.REDE5}>
					<DeleteRedSvg />
					<span className={'text-[#E04545]'}>Удалить выбранное</span>
				</WrapperButton>
			</Popconfirm>
		</div>
	)
}
