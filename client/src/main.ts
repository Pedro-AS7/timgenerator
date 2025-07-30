import JSZip from 'jszip'
import { saveAs } from 'file-saver'
import type { ImageUrl, ImagePreview, Checker, ImagesFormats } from './interfaces'
import * as u from './utils'

const xInput = document.getElementById('xAxis') as HTMLInputElement
const yInput = document.getElementById('yAxis') as HTMLInputElement
const bgInput = document.getElementById('BgColorPicker') as HTMLInputElement
const numImgInput = document.getElementById('numImages') as HTMLInputElement
const generateBtn = document.getElementById('generateBtn') as HTMLButtonElement
const imgExample = document.getElementById('img_ex') as HTMLCanvasElement
const checkNumerate = document.getElementById('numerateCheck') as HTMLInputElement
const checkBorder = document.getElementById('borderCheck') as HTMLInputElement
const borderColor = document.getElementById('borderColorPicker') as HTMLInputElement
const borderWidth = document.getElementById('borderWidth') as HTMLInputElement
const borderConfigContainer = document.getElementById('borderConfig') as HTMLDivElement
const imgFormatSelect = document.getElementById('imageFormat') as HTMLSelectElement
const formatPreview = document.getElementById('formatPreview') as HTMLSpanElement
const dimensionsInfo = document.getElementById('dimensions-info') as HTMLSpanElement

let generatedImageUrls: ImageUrl[] = []
let imagesFormats: ImagesFormats = { png: 'PNG', jpeg: 'JPEG', webp: 'WEBP' }
let isNumerate = true
let isBorder = false
let zipCounter = 1
const ctx = imgExample.getContext('2d') as CanvasRenderingContext2D
const img_preview: ImagePreview = {
	w: 400,
	h: 400,
	borderProportion: 1,
}

function getImgExScale() {
	let w = parseInt(xInput.value)
	let h = parseInt(yInput.value)
	if (w > h) {
		img_preview.borderProportion = 400 / w
		h = 400 / (w / h)
		w = 400
	} else {
		img_preview.borderProportion = 400 / h
		w = 400 / (h / w)
		h = 400
	}
	imgExample.width = w
	imgExample.height = h
	img_preview.w = w
	img_preview.h = h
	dimensionsInfo.textContent = `${xInput.value} x ${yInput.value} px`
}

function getImgBg() {
	ctx.fillStyle = bgInput.value
	ctx.fillRect(0, 0, imgExample.width, imgExample.height)
}

function getBorderColor(check: string = '') {
	if (check === 'check') {
		isBorder = !isBorder
	}
	if (isBorder) {
		borderConfigContainer.style.display = 'grid'
		if (borderWidth.value !== '0') {
			ctx.strokeStyle = borderColor.value
			ctx.lineWidth = parseInt(borderWidth.value) * img_preview.borderProportion
			console.log('line: ' + ctx.lineWidth)
			ctx.strokeRect(0, 0, img_preview.w, img_preview.h)
		}
	} else {
		borderConfigContainer.style.display = 'none'
	}
}

function setTextImage(check: string = '') {
	if (check === 'check') {
		isNumerate = !isNumerate
	}
	const hexBgColor = u.hexToRgb(bgInput.value)
	const averageRgb = (hexBgColor.r + hexBgColor.g + hexBgColor.b) / 3
	const selectedTextColor = averageRgb < 170 ? [255, 255, 255] : [0, 0, 0]
	const fontName = 'ArialCustom, Arial, sans-serif'

	if (isNumerate) {
		ctx.fillStyle = `rgb(${selectedTextColor[0]}, ${selectedTextColor[1]}, ${selectedTextColor[2]})`
		let fontSizeCalculated: number
		if (parseInt(xInput.value) >= parseInt(yInput.value)) {
			fontSizeCalculated = parseInt(
				String((((parseInt(yInput.value) / parseInt(xInput.value)) * 400 - 100) / 100) * 8 + 32)
			)
			if (xInput.value >= '1440') {
				fontSizeCalculated = fontSizeCalculated * 0.7
			}
		} else {
			fontSizeCalculated = parseInt(
				String((((parseInt(xInput.value) / parseInt(yInput.value)) * 400 - 100) / 100) * 8 + 32)
			)
			if (yInput.value >= '1440') {
				fontSizeCalculated = fontSizeCalculated * 0.7
			}
		}
		const currentFont = `${fontSizeCalculated}px ${fontName}`
		ctx.font = currentFont
		ctx.textAlign = 'center'
		ctx.textBaseline = 'middle'
		ctx.fillText(String(1), imgExample.width / 2, imgExample.height / 2)
	} else {
		getBorderColor()
	}
}

function borderWidthInputValidation() {
	let value = parseInt(borderWidth.value)

	if (borderWidth.value.length > 1 && parseInt(borderWidth.value) < 10) {
		borderWidth.value = parseInt(borderWidth.value).toString()
	}
	if (value < 0) {
		borderWidth.value = '0'
	} else if (value > parseInt(xInput.value)) {
		borderWidth.value = xInput.value
	}
}

function resolutionInputValidation(inp: HTMLInputElement) {
	let value: number = parseInt(inp.value)

	if (inp.value.length > 1 && parseInt(inp.value) < 10) {
		inp.value = parseInt(inp.value).toString()
	}
	if (inp.value.length === 0) {
		inp.value = '0'
	}
	if (value < 0) {
		inp.value = '0'
	} else if (value > 4096) {
		inp.value = '4096'
	}
}

function numberOfImegesInputValidation() {
	let value: number = parseInt(numImgInput.value)

	if (numImgInput.value.length > 1 && parseInt(numImgInput.value) < 10) {
		numImgInput.value = parseInt(numImgInput.value).toString()
	}
	if (value <= 0) {
		numImgInput.value = '1'
	} else if (value > 100) {
		numImgInput.value = '100'
	}
}

function updatePreview(checker: Checker) {
	getImgExScale()
	getImgBg()
	getBorderColor(checker.isCheckBorder)
	setTextImage(checker.isCheckNumerate)
}

function setContent() {
	imgExample.width = 400
	imgExample.height = 400
	updatePreview({})
}

document.addEventListener('DOMContentLoaded', setContent)

generateBtn.addEventListener('click', async () => {
	generateBtn.textContent = 'Generating...'
	await u.sleep(50)
	generateImages()
})
xInput.addEventListener('input', () => {
	resolutionInputValidation(xInput)
	updatePreview({})
})
yInput.addEventListener('input', () => {
	resolutionInputValidation(yInput)
	updatePreview({})
})
bgInput.addEventListener('input', () => updatePreview({}))
numImgInput.addEventListener('input', numberOfImegesInputValidation)
numImgInput.addEventListener('change', () => {
	if (numImgInput.value.length === 0) {
		numImgInput.value = '1'
	}
})
imgFormatSelect.addEventListener('change', () => {
	formatPreview.textContent = imagesFormats[imgFormatSelect.value as keyof ImagesFormats]
})
checkNumerate.addEventListener('change', () => updatePreview({ isCheckNumerate: 'check' }))
checkBorder.addEventListener('change', () => updatePreview({ isCheckBorder: 'check' }))
borderColor.addEventListener('input', () => updatePreview({}))
borderWidth.addEventListener('input', () => {
	borderWidthInputValidation()
	updatePreview({})
})

function generateImages() {
	const xAxis = parseInt(xInput.value)
	const yAxis = parseInt(yInput.value)
	const selectedBgColor = u.hexToRgb(bgInput.value)
	const averageRgb = (selectedBgColor.r + selectedBgColor.g + selectedBgColor.b) / 3
	const selectedTextColor = averageRgb < 170 ? [255, 255, 255] : [0, 0, 0]


	const fontName = 'ArialCustom, Arial, sans-serif'

	for (let i = 0; i < parseInt(numImgInput.value); i++) {
		const number = i + 1
		const canvas = document.createElement('canvas')
		canvas.width = xAxis
		canvas.height = yAxis
		const ctx = canvas.getContext('2d') as CanvasRenderingContext2D

		//Set Bg
		ctx.fillStyle = `rgb(${selectedBgColor.r}, ${selectedBgColor.g}, ${selectedBgColor.b})`
		ctx.fillRect(0, 0, canvas.width, canvas.height)
		console.log('generating...3')

		//set Text
		let fontSizeCalculated: number
		if (isNumerate) {
			ctx.fillStyle = `rgb(${selectedTextColor[0]}, ${selectedTextColor[1]}, ${selectedTextColor[2]})`
			if (xAxis > yAxis) {
				fontSizeCalculated = ((xAxis - 100) / 100) * 8 + 32
				if (xAxis >= 1440) fontSizeCalculated = fontSizeCalculated * 0.7
			} else {
				fontSizeCalculated = ((yAxis - 100) / 100) * 8 + 32
				if (yAxis >= 1440) fontSizeCalculated = fontSizeCalculated * 0.7
			}

			const currentFont = `${fontSizeCalculated}px ${fontName}`
			ctx.font = currentFont
			ctx.textAlign = 'center'
			ctx.textBaseline = 'middle'

			ctx.fillText(String(number), canvas.width / 2, canvas.height / 2)
		}

		if (isBorder) {
			if (borderWidth.value !== '0') {
				ctx.strokeStyle = borderColor.value
				ctx.lineWidth = parseInt(borderWidth.value)
				console.log('line: ' + ctx.lineWidth)
				ctx.strokeRect(0, 0, xAxis, yAxis)
			}
		}

		generatedImageUrls.push({
			name: `img_${number}.${imgFormatSelect.value}`,
			dataUrl: canvas.toDataURL(`image/${imgFormatSelect.value}`),
		})
	}

	if (generatedImageUrls.length > 0) {
		downloadImagesAsZip()
	} else {
        alert('Error generating images. Please try again.')
    }

}

async function downloadImagesAsZip() {
	await u.sleep(500)
	if (generatedImageUrls.length === 0) {
		return
	}
	const zip = new JSZip()

	for (const imgData of generatedImageUrls) {
		const base64Data = imgData.dataUrl.split(',')[1]
		zip.file(imgData.name, base64Data, { base64: true })
	}
	try {
		const zipBlob = await zip.generateAsync({ type: 'blob' })
		// Usa FileSaver.js para salvar o blob como um arquivo
		saveAs(zipBlob, `imagens_geradas${zipCounter}.zip`)
	} catch (error) {
		console.error('Erro ao gerar ZIP:', error)
		alert('Ocorreu um erro ao gerar o arquivo ZIP.')
	}
	generateBtn.textContent = 'Generate and Download Images'
	zipCounter++
}