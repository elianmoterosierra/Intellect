import type { Subject } from '../../../types';
import { SubjectModal } from '../AddTaskSection/AddSubjectModal/SubjectModal';

type SubjectEditModalProps = {
    courseId: number;
    subject: Subject;
    onClose: () => void;
};

export function SubjectEditModal({ courseId, subject, onClose }: SubjectEditModalProps) {
    return <SubjectModal courseId={courseId} subject={subject} onClose={onClose} />;
}
