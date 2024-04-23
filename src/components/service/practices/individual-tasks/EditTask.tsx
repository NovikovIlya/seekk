import { DeleteOutlined, PlusOutlined } from '@ant-design/icons'
import { MenuOutlined } from '@ant-design/icons'
import type { DragEndEvent } from '@dnd-kit/core'
import { DndContext } from '@dnd-kit/core'
import { restrictToVerticalAxis } from '@dnd-kit/modifiers'
import {
	SortableContext,
	arrayMove,
	useSortable,
	verticalListSortingStrategy
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { yupResolver } from '@hookform/resolvers/yup'
import { Button, Col, Input, Row, Select, Space, Typography } from 'antd'
import { Table } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import dayjs from 'dayjs'
import React, { useEffect, useState } from 'react'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'

import { ArrowLeftSvg } from '../../../../assets/svg'
import { DeleteSvg } from '../../../../assets/svg/DeleteSvg'
import {
	useChangeTaskMutation,
	useCreateTaskMutation,
	useGetTaskQuery
} from '../../../../store/api/practiceApi/taskService'
import { INewTaskType, NewTaskSchema } from '../validation'

interface IFormInput {
	practiceType: { label: string }
	specialityName: { label: string }
}

interface DataType {
	key: string
	name: string
}

interface RowProps extends React.HTMLAttributes<HTMLTableRowElement> {
	'data-row-key': string
}

const Rows = ({ children, ...props }: RowProps) => {
	const {
		attributes,
		listeners,
		setNodeRef,
		setActivatorNodeRef,
		transform,
		transition,
		isDragging
	} = useSortable({
		id: props['data-row-key']
	})

	const style: React.CSSProperties = {
		...props.style,
		transform: CSS.Transform.toString(transform && { ...transform, scaleY: 1 }),
		transition,
		...(isDragging ? { position: 'relative', zIndex: 9999 } : {})
	}

	return (
		<tr {...props} ref={setNodeRef} style={style} {...attributes}>
			{
				//@ts-ignore
				(React.Children as any).map(children, child => {
					if ((child as React.ReactElement).key === 'sort') {
						return React.cloneElement(child as React.ReactElement, {
							children: (
								<MenuOutlined
									ref={setActivatorNodeRef}
									style={{ touchAction: 'none', cursor: 'move' }}
									{...listeners}
								/>
							)
						})
					}
					return child
				})
			}
		</tr>
	)
}

type PropsType = {
	edit: string
	setEdit: (edit: string) => void
}

const EditTask = ({ edit, setEdit }: PropsType) => {
	const { data: task } = useGetTaskQuery(edit)
	const [editTask] = useChangeTaskMutation()
	const {
		control,
		handleSubmit,
		watch,
		setValue,
		getValues,
		formState: { errors },
		reset
	} = useForm<INewTaskType>({
		resolver: yupResolver(NewTaskSchema),
		mode: 'onBlur',
		defaultValues: {
			dataSource: []
		}
	})

	useEffect(() => {
		if (task) {
			reset(task)
			const currentDataSource = getValues('dataSource') || []
			const initialTasks = task.tasks.map((item, index) => {
				return {
					key: index,
					name: item
				}
			})
			setValue('dataSource', initialTasks, { shouldValidate: true })
		}
	}, [task])

	const [dataSource, setDataSource] = useState<{ key: string; name: string }[]>(
		[]
	)
	const columns: ColumnsType<DataType> = [
		{
			key: 'sort'
		},
		{
			key: 'x',
			render(_, __, index) {
				return <>{++index}</>
			}
		},
		{
			width: '100%',
			title: '',
			dataIndex: 'name'
		},
		{
			title: '',
			dataIndex: '',
			key: 'x',
			render: (param, __, index) => (
				<Space size="middle">
					<Button
						type="text"
						icon={<DeleteSvg />}
						danger
						onClick={() => handleDeleteTask(param.key)}
					/>
				</Space>
			)
		}
	]
	const onDragEnd = ({ active, over }: DragEndEvent) => {
		if (active.id !== over?.id) {
			const currentDataSource = getValues('dataSource') || []

			const activeIndex = currentDataSource.findIndex(
				(i: any) => i.key === active.id
			)
			const overIndex = currentDataSource.findIndex(
				(i: any) => i.key === over?.id
			)

			const updatedDataSource = arrayMove(
				currentDataSource,
				activeIndex,
				overIndex
			)

			setValue('dataSource', updatedDataSource, { shouldValidate: true })
		}
	}

	const dataTest = watch('dataSource')

	const handleAddTask = () => {
		const currentInputValue = watch('dataInput')
		const currentDataSource = getValues('dataSource') || []

		const newTask = {
			key: `${currentDataSource.length + 1}`,
			name: currentInputValue
		}

		const updatedDataSource = [...currentDataSource, newTask]

		setValue('dataSource', updatedDataSource, { shouldValidate: true })
		setValue('dataInput', '')
	}

	const handleDeleteTask = (key: string) => {
		const currentDataSource = getValues('dataSource') || []

		const updatedDataSource = currentDataSource.filter(
			(item: any) => item.key !== key
		)

		setValue('dataSource', updatedDataSource, { shouldValidate: true })
	}

	const onSubmit: SubmitHandler<INewTaskType> = data => {
		const { specialityName, practiceType } = data
		const namesArray = data.dataSource?.map(item => item.name)
		if (namesArray) {
			const newTask = {
				id: edit,
				specialityName: specialityName,
				practiceType: practiceType,
				tasks: namesArray
			}
			console.log(newTask)
			editTask(newTask)
				.unwrap()
				.then(() => {
					setEdit('')
				})
		}
	}
	const navigate = useNavigate()
	return (
		<section className="container">
			<Space size={10} align="center">
				<Button
					size="large"
					className="mt-1"
					icon={<ArrowLeftSvg className="w-4 h-4 cursor-pointer mt-1" />}
					type="text"
					onClick={() => setEdit('')}
				/>
				<Typography.Text className=" text-[28px] font-normal">
					Изменить
				</Typography.Text>
			</Space>
			<form onSubmit={handleSubmit(onSubmit)}>
				<Row gutter={[16, 16]} className="mt-4">
					<Col xs={24} sm={24} md={18} lg={16} xl={12}>
						<Space direction="vertical" className="w-full">
							<Typography.Text>
								Шифр и наименование специальности
							</Typography.Text>
							<Controller
								name="specialityName"
								control={control}
								render={({ field }) => (
									<Select
										{...field}
										size="large"
										popupMatchSelectWidth={false}
										placeholder=""
										defaultValue=""
										className="w-full"
										options={[
											{
												value: '31.08.01 Акушерство и гинекология',
												label: '31.08.01 Акушерство и гинекология'
											},
											{
												value: '31.08.12 Педиатрия',
												label: '31.08.12 Педиатрия'
											}
										]}
									/>
								)}
							/>
						</Space>
					</Col>
				</Row>
				<Row gutter={[16, 16]} className="mt-4">
					<Col xs={24} sm={24} md={18} lg={16} xl={12}>
						<Space direction="vertical" className="w-full z-10">
							<Typography.Text>Тип практики</Typography.Text>
							<Controller
								name="practiceType"
								control={control}
								render={({ field }) => (
									<Select
										{...field}
										size="large"
										popupMatchSelectWidth={false}
										placeholder=""
										defaultValue=""
										className="w-full"
										options={[
											{
												value: 'Производственная',
												label: 'Производственная'
											},
											{
												value: 'Учебная',
												label: 'Учебная'
											}
										]}
									/>
								)}
							/>
						</Space>
					</Col>
				</Row>
				<Space direction="vertical" className="w-full  mb-4 mt-8">
					<Typography.Text className="font-bold">
						Индивидуальные задания
					</Typography.Text>
				</Space>
				<Row>
					<Col span={24}>
						<DndContext
							modifiers={[restrictToVerticalAxis]}
							onDragEnd={onDragEnd}
						>
							<SortableContext
								// rowKey array
								items={dataTest ? dataTest.map((i: any) => i.key) : []}
								strategy={verticalListSortingStrategy}
							>
								<Table
									components={{
										body: {
											row: Rows
										}
									}}
									showHeader={false}
									pagination={false}
									rowKey="key"
									bordered={false}
									columns={columns}
									dataSource={dataTest}
								/>
							</SortableContext>
						</DndContext>
					</Col>
				</Row>
				<Row gutter={[16, 16]} className="mt-4">
					<Col xs={24} sm={24} md={18} lg={16} xl={12}>
						<Controller
							name="dataInput"
							control={control}
							render={({ field }) => (
								<Space.Compact style={{ width: '100%' }}>
									<Input
										{...field}
										size="large"
										placeholder="type task..."
										suffix={
											errors.dataSource &&
											errors.dataSource.message && (
												<Typography.Text type="danger">
													{errors.dataSource.message}
												</Typography.Text>
											)
										}
									/>
									<Button
										size="large"
										type="primary"
										icon={<PlusOutlined />}
										onClick={handleAddTask}
									/>
								</Space.Compact>
							)}
						/>
					</Col>
				</Row>
				<Row gutter={[16, 16]} className="my-8">
					<Col xs={24} sm={24} md={18} lg={8} xl={6}>
						<Space className="w-full">
							<Button
								className="!rounded-full"
								size="large"
								type="primary"
								htmlType="submit"
							>
								Сохранить
							</Button>
						</Space>
					</Col>
				</Row>
			</form>
		</section>
	)
}

export default EditTask