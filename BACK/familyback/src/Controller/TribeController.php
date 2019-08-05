<?php

namespace App\Controller;

use App\Entity\Tribe;
use App\Form\TribeType;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

class TribeController extends AbstractController
{
    /**
     * @Route("/tribe", name="tribe")
     */
    public function index()
    {
        $connectedUser = $this->getUser();
        $userTribeId = $connectedUser->getTribe();

        return $this->render('tribe/index.html.twig', [
            'tribe' => $userTribeId,
        ]);
    }

    /**
     * @Route("/tribe/new", name="newTribe", methods={"GET","POST"})
     */
    public function newTribe(Request $request): Response
    {
        if ($this->getUser()->getTribe() != null) {

            $this->addFlash(
                'success',
                'Impossible de créer une nouvelle tribu. Vous faîtes déjà parti de la tribu des '. $this->getUser()->getTribe() .' !'
            );

            return $this->redirectToRoute('tribe');
        }

        $tribe = new Tribe();
        $form = $this->createForm(TribeType::class, $tribe);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {

            $user = $this->getUser();

            $user->setTribe($tribe);

            $entityManager = $this->getDoctrine()->getManager();
            $entityManager->persist($tribe);
            $entityManager->persist($user);
            $entityManager->flush();

            $this->addFlash(
                'success',
                'Nouvelle tribu créée !'
            );
            
            return $this->redirectToRoute('profile_index');
        }

        return $this->render('tribe/newTribe.html.twig', [
            'tribe' => $tribe,
            'form' => $form->createView(),
        ]);
    }

    


}
