import { useCallback, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Papa from 'papaparse'
import fileDownload from 'js-file-download'
import { account, utils } from '@senswap/sen-js'

import { Space, Typography, Upload, Image, Spin, Row, Col, Button } from 'antd'
import FileDetails from './fileDetails'
import ModalMerge from 'app/components/commonModal'
import IonIcon from 'shared/antd/ionicon'

import iconUpload from 'app/static/images/icon-upload.svg'
import { AppState } from 'app/model'
import exampleCSV from 'app/static/base/example.csv'
import {
  addRecipients,
  RecipientInfo,
  RecipientInfos,
  removeRecipients,
  setErrorData,
} from 'app/model/recipients.controller'
import useMintDecimals from 'shared/hooks/useMintDecimals'
import { setFileName } from 'app/model/file.controller'

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
  const [visible, setVisible] = useState(false)
  const [listDuplicate, setListDuplicate] = useState<
    Record<string, RecipientInfo>
  >({})
  const {
    recipients: { recipients },
    main: { mintSelected },
  } = useSelector((state: AppState) => state)
  const mintDecimals = useMintDecimals(mintSelected) || 0

  const detectErrorData = useCallback((data: RecipientInfos) => {
    const errorData = data.filter(
      (recipient) => recipient.includes('') || !account.isAddress(recipient[0]),
    )

    const successData = data.filter(
      (recipient) => !recipient.includes('') && account.isAddress(recipient[0]),
    )
    return { errorData, successData }
  }, [])

  const upload = useCallback(
    async (file: any) => {
      setLoading(true)

      const data = await parse(file)
      const { errorData, successData: recipients } = await detectErrorData(data)
      if (errorData) dispatch(setErrorData({ errorData }))
      if (!mintDecimals) return

      const recipient: Record<string, RecipientInfo> = {}
      let isDuplicate = false
      for (const [address, amount] of recipients) {
        if (recipient[address]) {
          isDuplicate = true
          const [walletAddress, oldAmount] = recipient[address]

          const newAmount =
            utils.decimalize(oldAmount, mintDecimals) +
            utils.decimalize(amount, mintDecimals)

          recipient[address] = [
            walletAddress,
            utils.undecimalize(newAmount, mintDecimals),
          ]
        } else recipient[address] = [address, amount]
      }

      if (isDuplicate) {
        setListDuplicate(recipient)
        setLoading(false)
        setVisible(true)
        dispatch(setFileName(file.name))
        return true
      }

      dispatch(setFileName(file.name))
      dispatch(addRecipients({ recipients }))
      setLoading(false)
      setVisible(false)
      return false
    },
    [detectErrorData, dispatch, mintDecimals],
  )

  const remove = async () => {
    dispatch(removeRecipients())
    setListDuplicate({})
    return true
  }

  const onMerge = () => {
    const recipients = Object.values(listDuplicate)
    dispatch(addRecipients({ recipients }))
    return setVisible(false)
  }

  const onCancel = () => {
    setVisible(false)
    dispatch(setFileName(''))
    setListDuplicate({})
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
        <ModalMerge
          title="Do you want to merge wallet addresses?"
          description="There are some wallet addresses that are the same."
          visible={visible}
          setVisible={setVisible}
          onConfirm={onMerge}
          onCancel={onCancel}
          btnText="merge"
        />
      </Row>
    )
  return <FileDetails remove={remove} />
}

export default UploadFile