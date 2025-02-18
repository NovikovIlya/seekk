import type { InputRef } from 'antd'
import { Input, Space, Tag, Tooltip } from 'antd'
import React, { useEffect, useRef, useState } from 'react'

export const Skills: React.FC = () => {
	const [tags, setTags] = useState(['Unremovable', 'Tag 2', 'Tag 3'])
	const [inputVisible, setInputVisible] = useState(false)
	const [inputValue, setInputValue] = useState('')
	const [editInputIndex, setEditInputIndex] = useState(-1)
	const [editInputValue, setEditInputValue] = useState('')
	const inputRef = useRef<InputRef>(null)
	const editInputRef = useRef<InputRef>(null)

	useEffect(() => {
		if (inputVisible) {
			inputRef.current?.focus()
		}
	}, [inputVisible])

	useEffect(() => {
		editInputRef.current?.focus()
	}, [editInputValue])

	const handleClose = (removedTag: string) => {
		const newTags = tags.filter(tag => tag !== removedTag)
		console.log(newTags)
		setTags(newTags)
	}

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setInputValue(e.target.value)
	}

	const handleInputConfirm = () => {
		if (inputValue && !tags.includes(inputValue)) {
			setTags([...tags, inputValue])
		}
		setInputVisible(false)
		setInputValue('')
	}

	const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setEditInputValue(e.target.value)
	}

	const handleEditInputConfirm = () => {
		const newTags = [...tags]
		newTags[editInputIndex] = editInputValue
		setTags(newTags)
		setEditInputIndex(-1)
		setEditInputValue('')
	}

	return (
		<>
			<Input
				ref={inputRef}
				type="text"
				className="mb-3"
				size="large"
				value={inputValue}
				onChange={handleInputChange}
				onBlur={handleInputConfirm}
				onPressEnter={handleInputConfirm}
			/>
			<Space size={[8, 8]} wrap>
				{tags.map((tag, index) => {
					if (editInputIndex === index) {
						return (
							<Input
								ref={editInputRef}
								key={tag}
								value={editInputValue}
								onChange={handleEditInputChange}
								onBlur={handleEditInputConfirm}
								onPressEnter={handleEditInputConfirm}
							/>
						)
					}
					const isLongTag = tag.length > 20
					const tagElem = (
						<Tag
							key={tag}
							className="h-8 m-0 bg-transparent border-black flex items-center justify-center rounded-full"
							closable
							style={{ userSelect: 'none' }}
							onClose={() => handleClose(tag)}
						>
							<span
								onDoubleClick={e => {
									setEditInputIndex(index)
									setEditInputValue(tag)
									e.preventDefault()
								}}
							>
								{isLongTag ? `${tag.slice(0, 20)}...` : tag}
							</span>
						</Tag>
					)
					return isLongTag ? (
						<Tooltip title={tag} key={tag}>
							{tagElem}
						</Tooltip>
					) : (
						tagElem
					)
				})}
			</Space>
		</>
	)
}
