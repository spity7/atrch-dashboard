import { Card, CardBody, Col, Row } from 'react-bootstrap'
import PageBreadcrumb from '@/components/layout/PageBreadcrumb'
import CreateHandizForms from './components/CreateHandizForms'
import PageMetaData from '@/components/PageTitle'

const CreateHandiz = () => {
  return (
    <>
      <PageBreadcrumb title="Create Handiz" subName="Atrch" />
      <PageMetaData title="Create Handiz" />

      <Row>
        <Col>
          <Card>
            <CardBody>
              <CreateHandizForms />
            </CardBody>
          </Card>
        </Col>
      </Row>
    </>
  )
}
export default CreateHandiz
