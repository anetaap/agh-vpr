import matplotlib.cm as cm
import torch
import pickle
from VPR.models.matching import Matching
from VPR.models.superpoint import SuperPoint
from VPR.models.utils import read_image

from database import get_db
import crud
import schemas


# TODO: hash function

def match(img_name):
    torch.set_grad_enabled(False)

    device = 'cuda' if torch.cuda.is_available() else 'cpu'

    config = {
        'superpoint': {
            'nms_radius': 4,
            'keypoint_threshold': 0.005,
            'max_keypoints': 1024
        },
        'superglue': {
            'weights': 'outdoor',
            'sinkhorn_iterations': 20,
            'match_threshold': 0.2,
        }
    }

    matching = Matching(config).eval().to(device)
    superpoint = SuperPoint(config.get('superpoint', {}))

    with open('tmp_images.p', 'rb') as fp:
        images = pickle.load(fp)

    image0, inp0, scales0 = read_image(f"ImgFromUser/{img_name}", device, [640, 480], 0, 1)
    pred = {}
    pred0 = superpoint({'image': inp0})
    pred = {**pred, **{k + '1': v for k, v in pred0.items()}}

    best = (0, None)

    for image in images:
        pred1 = {}
        pred1['image0'] = inp0
        pred1 = {**pred1, **{k + '0': v for k, v in pred0.items()}}
        pred1 = {**pred1, **{k + '1': v for k, v in images[image].items()}}
        pred = matching(pred1)
        pred = {k: v[0].cpu().numpy() for k, v in pred.items()}
        kpts0, kpts1 = pred['keypoints0'], pred['keypoints1']
        matches, conf = pred['matches0'], pred['matching_scores0']

        valid = matches > -1
        mkpts0 = kpts0[valid]

        if len(mkpts0) > best[0]:
            best = (len(mkpts0), image)

    return best


