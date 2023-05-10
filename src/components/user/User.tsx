import React, { useState } from 'react'

import DropDrag from '../dnd/DropDrag'
import { block } from '../dnd/constant'
import { Layout } from '../layout/Layout'

export const User = () => {
	const [edit, setEdit] = useState(true)
	const [layouts, setLayouts] = useState<{ [index: string]: any[] }>(() => {
		return localStorage.getItem('dashboard')
			? JSON.parse(localStorage.getItem('dashboard') || '')
			: block
	})
	return (
		<Layout>
			<DropDrag edit={edit} layouts={layouts} setLayouts={setLayouts} />
		</Layout>
	)
}
