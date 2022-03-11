import { useCallback, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Papa from 'papaparse'
import fileDownload from 'js-file-download'

import { Space, Typography, Upload, Image, Spin, Row, Col, Button } from 'antd'

import { setFileName } from 'app/model/main.controller'
import FileDetails from './fileDetails'

import iconUpload from 'app/static/images/icon-upload.svg'
import { AppState } from 'app/model'
import IonIcon from 'shared/antd/ionicon'
import exampleCSV from 'app/static/base/example.csv'
import {
  addRecipients,
  RecipientInfos,
  removeRecipients,
  setErrorDatas,
} from 'app/model/recipients.controller'
import { account } from '@senswap/sen-js'

const parse = (file: any): Promise<RecipientInfos> => {
  return new Promise((resolve, reject) => {
    return Papa.parse(file, {
      skipEmptyLines: true,
      complete: ({ data }) => resolve(data as RecipientInfos),
    })
  })
}

const UploadFile = () => {
  const dispatch = useDispatch()
  const [loading, setLoading] = useState(false)
  const {
    recipients: { recipients },
  } = useSelector((state: AppState) => state)

  const detectErrorData = (data: RecipientInfos) => {
    const errorDatas = data.filter(
      (recipient) => recipient.includes('') || !account.isAddress(recipient[0]),
    )
    const successData = data.filter(
      (recipient) => !recipient.includes('') && account.isAddress(recipient[0]),
    )
    return { errorDatas, successData }
  }

  const upload = useCallback(
    async (file: any) => {
      setLoading(true)
      const data = await parse(file)
      const { errorDatas, successData: recipients } = await detectErrorData(
        data,
      )
      dispatch(setFileName(file.name))
      dispatch(addRecipients({ recipients }))
      dispatch(setErrorDatas({ errorDatas }))
      setLoading(false)
      return false
    },
    [dispatch],
  )

  const remove = async () => {
    setLoading(true)
    dispatch(removeRecipients())
    setLoading(false)
    return true
  }

  const getFileCSV = async (fileCSV: string) => {
    return fetch(fileCSV).then(function (response) {
      let reader = response.body?.getReader()
      let decoder = new TextDecoder('utf-8')
      return reader?.read().then(function (result) {
        return decoder.decode(result.value)
      })
    })
  }

  const onDownload = async () => {
    if (!exampleCSV) return
    const file = (await getFileCSV(exampleCSV)) || ''
    fileDownload(file, 'example.csv')
  }

  if (!recipients.length)
    return (
      <Row gutter={[8, 8]} justify="end">
        <Col span={24}>
          <Spin spinning={loading}>
            <Upload.Dragger
              accept=".csv,.txt"
              beforeUpload={upload}
              onRemove={remove}
              maxCount={1}
              className="upload-file"
              showUploadList
              progress={{ strokeWidth: 2, showInfo: true }}
              fileList={[]}
            >
              <Space direction="vertical" size={24} align="center">
                <Image src={iconUpload} preview={false} />
                <Space direction="vertical" size={4} align="center">
                  <Typography.Text>
                    Click or Drop file to upload
                  </Typography.Text>
                  <Typography.Text type="secondary">
                    The accepted file types are <code>.csv</code>,{' '}
                    <code>.txt</code>.
                  </Typography.Text>
                </Space>
              </Space>
            </Upload.Dragger>
          </Spin>
        </Col>
        <Col>
          <Button
            type="text"
            style={{ padding: 0, background: 'transparent', fontWeight: 700 }}
            icon={<IonIcon name="download-outline" />}
            onClick={onDownload}
          >
            Download sample
          </Button>
        </Col>
      </Row>
    )
  return <FileDetails onRemove={remove} />
}

export default UploadFile
