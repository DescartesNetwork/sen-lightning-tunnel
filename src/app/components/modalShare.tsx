import CopyToClipboard from 'react-copy-to-clipboard'
import { useState } from 'react'

import {
  Modal,
  Image,
  Space,
  Typography,
  Row,
  Col,
  Button,
  Tooltip,
} from 'antd'
import IonIcon from 'shared/antd/ionicon'

import { asyncWait } from 'shared/util'

import TWITTER from 'app/static/images/twitter.svg'

const ModalShare = ({
  visible,
  redeemLink,
  setVisible,
}: {
  visible: boolean
  redeemLink: string
  setVisible: (visible: boolean) => void
}) => {
  const [copied, setCopied] = useState(false)

  const onShare = () => {
    let url = 'http://twitter.com/intent/tweet?'

    const params: Record<string, string> = {
      url: redeemLink,
      text: 'Your prize has arrived! Redeem now at Sen Hub: ',
    }
    for (const prop in params)
      url += '&' + prop + '=' + encodeURIComponent(params[prop] || '')
    window.open(url, '_blank')
  }

  const shortenRedeemLink = (redeemLink: string) => {
    const perfectLength = 40
    const delimiter = '...'
    return redeemLink.substring(0, perfectLength) + delimiter
  }

  const onCopy = async () => {
    setCopied(true)
    await asyncWait(1500)
    setCopied(false)
  }

  return (
    <Modal
      visible={visible}
      closeIcon={<IonIcon name="close-outline" />}
      onCancel={() => setVisible(false)}
      footer={null}
      className="card-lightning"
      style={{ paddingBottom: 0 }}
    >
      <Row gutter={[32, 32]} style={{ textAlign: 'center' }}>
        <Col span={24}>
          <Image src={TWITTER} preview={false} />
        </Col>
        <Col span={24}>
          <Space direction="vertical" size={4}>
            <Typography.Title level={3}>Share on Twitter!</Typography.Title>
            <Space size={4}>
              <Typography.Text type="secondary">
                You need to share this transaction in order for the recipient to
                get the token.
              </Typography.Text>
            </Space>
          </Space>
        </Col>
        <Col span={24}>
          <Button type="primary" onClick={onShare}>
            Share now
          </Button>
        </Col>
        <Col span={24}>
          <Row gutter={[8, 8]}>
            <Col span={24} style={{ textAlign: 'left' }}>
              <Typography.Text>Or copy link</Typography.Text>
            </Col>
            <Col span={24}>
              <Row gutter={8} justify="space-between">
                <Col className="share-link" span={20}>
                  <Typography.Text>
                    {shortenRedeemLink(redeemLink)}
                  </Typography.Text>
                </Col>
                <Col span={4}>
                  <Tooltip title="Copied" visible={copied}>
                    <CopyToClipboard text={redeemLink}>
                      <Button
                        style={{ height: 40 }}
                        type="ghost"
                        onClick={onCopy}
                      >
                        copy
                      </Button>
                    </CopyToClipboard>
                  </Tooltip>
                </Col>
              </Row>
            </Col>
          </Row>
        </Col>
      </Row>
    </Modal>
  )
}

export default ModalShare
